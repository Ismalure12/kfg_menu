import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

export const maxDuration = 310;

export async function POST(request) {
  const { reference } = await request.json();
  if (!reference) {
    return NextResponse.json({ error: 'reference required' }, { status: 400 });
  }

  const session = await prisma.paymentSession.findUnique({ where: { reference } });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  // Strip leading zeros and any non-digit characters from phone
  const accountNo = session.phone.replace(/^0+/, '');

  const waafiBody = {
    schemaVersion: '1.0',
    requestId,
    timestamp,
    channelName: 'WEB',
    serviceName: 'API_PURCHASE',
    serviceParams: {
      merchantUid: process.env.WAAFI_MERCHANT_UID,
      apiUserId: process.env.WAAFI_API_USER_ID,
      apiKey: process.env.WAAFI_API_KEY,
      paymentMethod: 'MWALLET_ACCOUNT',
      payerInfo: { accountNo },
      transactionInfo: {
        referenceId: reference,
        invoiceId: reference,
        amount: Number(session.amount).toFixed(2),
        currency: 'USD',
        description: 'KFG Food Order',
      },
    },
  };

  let waafiRes;
  try {
    const res = await fetch(
      process.env.NODE_ENV === 'production'
        ? 'https://api.waafipay.com/asm'
        : 'http://sandbox.waafipay.net/asm',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(waafiBody),
      }
    );
    waafiRes = await res.json();
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }

  const code = waafiRes?.responseCode;
  const state = waafiRes?.params?.state;

  if (code === '5306') return NextResponse.json({ error: 'cancelled' });
  if (code === '5309') return NextResponse.json({ error: 'timeout' });
  if (code !== '2001' || state !== 'APPROVED') {
    return NextResponse.json({ error: 'failed' });
  }

  // Success — upsert customer, create order, delete session in a transaction
  const cart = session.cartJson;
  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone: session.phone },
      update: { name: session.name, address: session.address },
      create: { phone: session.phone, name: session.name, address: session.address },
    });

    const order = await tx.order.create({
      data: {
        customerId: customer.id,
        items: cart,
        total: session.amount,
        address: session.address,
        status: 'confirmed',
        reference,
      },
    });

    await tx.paymentSession.delete({ where: { reference } });

    return { customer, order };
  });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ customerId: result.customer.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1y')
    .sign(secret);

  return NextResponse.json({ success: true, token, reference });
}
