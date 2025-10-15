import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Mock user ID for now. In a real app, this would come from the session.
// This ID must match a seeded user ID in `src/lib/seed.ts`.
const MOCK_USER_ID = '72890a1a-4530-4355-8854-82531580e0a5';

export async function GET() {
  try {
    const websites = await sql`
      SELECT * FROM websites 
      WHERE user_id = ${MOCK_USER_ID} 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(websites, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch websites:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, url } = await request.json();

    if (!name || !url) {
      return NextResponse.json({ message: '网站名称和URL是必需的。' }, { status: 400 });
    }

    const websiteData = {
        name,
        url,
        userId: MOCK_USER_ID
    };

    const newWebsite = await sql`
      INSERT INTO websites ${sql(websiteData, 'name', 'url', 'userId')}
      RETURNING *
    `;
    
    revalidatePath('/dashboard/integration');

    return NextResponse.json(newWebsite[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create website:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
