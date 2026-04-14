import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const checkoutSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
  address: z.string().min(1).max(500),
  cart: z.array(z.object({
    name: z.string(),
    variant: z.string().optional(),
    price: z.number(),
    quantity: z.number().int().positive(),
  })).min(1),
  total: z.number().positive(),
});

export async function POST(request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { name, phone, address, cart, total } = parsed.data;
  const cleanPhone = phone.replace(/\D/g, '');
  const reference = 'kfg-' + crypto.randomUUID();

  await prisma.paymentSession.create({
    data: {
      reference,
      phone: cleanPhone,
      name,
      address,
      cartJson: cart,
      amount: total,
    },
  });

  return NextResponse.json({ reference });
}
