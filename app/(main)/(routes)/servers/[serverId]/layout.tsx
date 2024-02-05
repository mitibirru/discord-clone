import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import ServerSidebar from '@/components/server/server-sidebar';

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode; params: { serverId: string } }) => {
	const profile = await currentProfile();

	if (!profile) return redirectToSignIn();

	const server = await db.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id
				}
			}
		}
	});

	if (!server) redirect('/');

	return (
		<div className="h-full">
			<div className="z-20 fixed inset-y-0 hidden md:flex w-60 flex-col">
				<ServerSidebar serverId={params.serverId} />
			</div>
			<main className="h-full md:pl-60">{children}</main>
		</div>
	);
};

export default ServerIdLayout;
