import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import CheckoutClient from './CheckoutClient';

async function getPrefill() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('kfg_auth')?.value;
    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (!payload?.customerId) return null;

    const customer = await prisma.customer.findUnique({
      where: { id: payload.customerId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { address: true },
        },
      },
    });
    if (!customer) return null;

    return {
      name: customer.name,
      phone: customer.phone,
      address: customer.orders[0]?.address ?? customer.address,
    };
  } catch {
    return null;
  }
}

export default async function CheckoutPage() {
  const prefill = await getPrefill();
  return <CheckoutClient prefill={prefill} />;
}
