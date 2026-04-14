import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sinceId = parseInt(searchParams.get('lastId') ?? '0', 10);

  const encoder = new TextEncoder();
  let lastId = sinceId;
  let heartbeatTimer;
  let pollTimer;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keepalive
      controller.enqueue(encoder.encode(': connected\n\n'));

      const poll = async () => {
        try {
          const newOrders = await prisma.order.findMany({
            where: { id: { gt: lastId } },
            orderBy: { id: 'asc' },
            include: { customer: { select: { name: true, phone: true } } },
          });

          if (newOrders.length > 0) {
            lastId = newOrders[newOrders.length - 1].id;
            const payload = newOrders.map((o) => ({
              id: o.id,
              reference: o.reference,
              status: o.status,
              total: o.total.toString(),
              address: o.address,
              items: o.items,
              createdAt: o.createdAt,
              customer: o.customer,
            }));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }
        } catch {
          // DB error — skip this tick
        }
      };

      // Heartbeat every 20 s to keep connection alive
      heartbeatTimer = setInterval(() => {
        try { controller.enqueue(encoder.encode(': ping\n\n')); } catch { /* closed */ }
      }, 20_000);

      // Poll for new orders every 3 s
      pollTimer = setInterval(poll, 3_000);
    },
    cancel() {
      clearInterval(heartbeatTimer);
      clearInterval(pollTimer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
