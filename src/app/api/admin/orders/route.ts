import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function isAdmin(req: Request) {
  // Check the admin_access cookie from request headers
  const cookieHeader = req.headers.get('cookie') || '';
  return cookieHeader.includes('admin_access=true');
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminClient = createAdminClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = adminClient
      .from('orders')
      .select(`
        *,
        customers ( id, full_name, email, phone ),
        order_items ( * ),
        payment_attempts ( * )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,shipping_full_name.ilike.%${search}%,shipping_email.ilike.%${search}%,shipping_phone.ilike.%${search}%`
      );
    }

    const { data: orders, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({ orders, total: count, page, limit });
  } catch (error: any) {
    console.error('Admin orders fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
