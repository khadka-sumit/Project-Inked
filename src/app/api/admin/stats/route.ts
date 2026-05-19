import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function isAdmin(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  return cookieHeader.includes('admin_access=true');
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const adminClient = createAdminClient();

    const [ordersResult, customersResult] = await Promise.all([
      adminClient.from('orders').select('status, total_amount, created_at'),
      adminClient.from('customers').select('id', { count: 'exact', head: true }),
    ]);

    if (ordersResult.error) throw ordersResult.error;

    const orders = ordersResult.data || [];
    const totalRevenue = orders
      .filter(o => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // Last 7 days orders
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = orders.filter(o => new Date(o.created_at) >= sevenDaysAgo).length;

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue,
      totalCustomers: customersResult.count || 0,
      recentOrders,
      statusCounts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
