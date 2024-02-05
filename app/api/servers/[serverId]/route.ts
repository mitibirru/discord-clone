import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
	try {
		const profile = await currentProfile();
		if (!profile) return new NextResponse('Unauthorized', { status: 400 });

		const { name, imageUrl } = await req.json();

		const server = await db.server.update({
			where: {
				profileId: profile.id,
				id: params.serverId
			},
			data: {
				name,
				imageUrl
			}
		});

		return NextResponse.json(server);
	} catch (error) {
		console.error('[SERVER_ID_PATCH]', error);
		return new NextResponse('INTERNAL ERROR', { status: 500 });
	}
}
