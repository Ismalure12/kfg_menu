import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');
  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { reference: ref },
    include: { customer: { select: { name: true, phone: true } } },
  });

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    reference: order.reference,
    items: order.items,
    total: order.total.toString(),
    address: order.address,
    status: order.status,
    createdAt: order.createdAt,
    customer: order.customer,
  });
}
