import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const addSchema = z.object({
  cartId: z.string().min(1).max(100),
  itemName: z.string().min(1).max(200),
  variantLabel: z.string().max(100).optional().nullable(),
  price: z.number().positive(),
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });

  const items = await prisma.cartItem.findMany({
    where: { cartId },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(
    items.map((i) => ({ ...i, price: i.price.toString() }))
  );
}

export async function POST(request) {
  const body = await request.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { cartId, itemName, variantLabel, price } = parsed.data;
  const item = await prisma.cartItem.create({
    data: { cartId, itemName, variantLabel, price },
  });

  return NextResponse.json({ ...item, price: item.price.toString() }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');
  if (!cartId) return NextResponse.json({ error: 'cartId required' }, { status: 400 });

  await prisma.cartItem.deleteMany({ where: { cartId } });
  return NextResponse.json({ success: true });
}
