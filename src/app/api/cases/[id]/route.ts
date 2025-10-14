import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

type RouteParams = {
    params: {
        id: string;
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ message: '缺少案例 ID。' }, { status: 400 });
    }

    try {
        const { status } = await request.json();
        if (!status || !['open', 'in-progress', 'resolved'].includes(status)) {
            return NextResponse.json({ message: '无效的状态值。' }, { status: 400 });
        }
        
        const result = await sql`
            UPDATE cases 
            SET status = ${status}, updated_at = ${new Date().toISOString()} 
            WHERE id = ${id} 
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json({ message: '未找到案例。' }, { status: 404 });
        }

        return NextResponse.json(result[0], { status: 200 });

    } catch (error) {
        console.error(`Failed to update case ${id}:`, error);
        return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
    }
}
