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
		const client = entry.client;
		const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;
		
		return (entry.messages || []).map((msg) => {
			const safeClient = msg.client ?? client; // fallback si msg.client no está
			
			return {
				id: msg.id,
				threadId,
				type: "text",
				content: msg.content ?? "[Mensaje vacío]",
				direction: msg.direction,
				author: {
					id: msg.direction === "INCOMING"
					? `USR-${safeClient?.id ?? "???"}`
					: agentId,
					name: msg.direction === "INCOMING"
					? safeClient?.name ?? "Cliente"
					: "Tú",
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
