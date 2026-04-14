import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: { select: { name: true, phone: true } } },
  });

  return NextResponse.json(orders.map((o) => ({
    id: o.id,
    reference: o.reference,
    status: o.status,
    total: o.total.toString(),
    address: o.address,
    items: o.items,
    createdAt: o.createdAt,
    customer: o.customer,
  })));
}
