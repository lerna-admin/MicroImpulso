import * as React from "react";

import { getUser } from "@/lib/custom-auth/server";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";
import { ChatView } from "@/components/dashboard/chat/chat-view";
import { ChatLoader } from "@/components/dashboard/chat/chat-loader";
import { getAllConversationsByAgent } from "./hooks/use-conversations";

export default async function Layout({ children }) {
	const {
		data: { user },
	} = await getUser();

	const resp = await getAllConversationsByAgent(user.id);

	const contacts = resp.map(({ client }) => client);

	let threadCounter = 1;

	const messages = resp.flatMap((entry) => {
		const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;

		return entry.messages.map((msg) => {
			return {
				id: msg.id,
				threadId: threadId,
				type: "text",
				content: msg.content,
				direction: msg.direction,
				author: {
					id: msg.direction === "INCOMING" ? `USR-${msg.client.id}` : user.id,
					name: msg.direction === "INCOMING" ? msg.client.name || "Sin nombre" : user.name,
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

	  return <ChatLoader agentId={user.id}>{children}</ChatLoader>;

}
