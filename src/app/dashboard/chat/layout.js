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

	const contacts = resp.map(({ client }) => ({ id: client.id, name: client.name }));

	let threadCounter = 1;

	const messages = resp.flatMap((entry) => {
		const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;

		return entry.messages.map((msg) => {
			return {
				id: msg.id,
				threadId: threadId,
				type: "text",
				content: msg.content,
				author: {
					id: `USR-${msg.client.id}`,
					name: msg.client.name || "Sin nombre",
				},
				createdAt: new Date(msg.createdAt),
			};
		});
	});

	const threads = resp.map(({ client }, index) => ({
		id: `TRD-00${index + 1}`,
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
