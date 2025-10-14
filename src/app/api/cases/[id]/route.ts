import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
        
        const result = await db.query(
            'UPDATE cases SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
            [status, new Date().toISOString(), id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ message: '未找到案例。' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });

    } catch (error) {
        console.error(`Failed to update case ${id}:`, error);
        return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
    }
}

    