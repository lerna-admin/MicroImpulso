import * as React from "react";

import { getUser } from "@/lib/custom-auth/server";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";
import { ChatView } from "@/components/dashboard/chat/chat-view";

import { getAllConversationsByAgent } from "./hooks/use-conversations";

export default async function Layout({ children }) {
	const {
		data: { user },
	} = await getUser();

	const resp = await getAllConversationsByAgent(user.id);

	const contacts = resp.map(({ client }) => client);

	// Thread ID now depends on client.id — stable and URL-friendly
	const messages = resp.flatMap((entry) => {
		const client = entry.client;
		const threadId = `TRD-${client.id}`;

		return (entry.messages || []).map((msg) => {
			const safeClient = msg.client ?? client;

			return {
				id: msg.id,
				threadId,
				type: "text",
				content: msg.content ?? "[Empty message]",
				direction: msg.direction,
				author: {
					id: msg.direction === "INCOMING" ? `USR-${safeClient.id}` : user.id,
					name: msg.direction === "INCOMING" ? safeClient.name ?? "Cliente" : user.name,
				},
				createdAt: new Date(msg.createdAt),
			};
		});
	});

	const threads = resp.map(({ client }) => ({
		id: `TRD-${client.id}`,
		type: "direct",
		participants: [
			{ id: user.id, name: user.name },
			{ id: client.id, name: client.name },
		],
	}));

	return (
		<ChatProvider contacts={contacts} messages={messages} threads={threads}>
			<ChatView>{children}</ChatView>
		</ChatProvider>
	);
}
