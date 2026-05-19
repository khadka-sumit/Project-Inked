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
    const { data: customers, error, count } = await adminClient
      .from('customers')
      .select('*, orders(id, order_number, total_amount, status, created_at)', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ customers, total: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
