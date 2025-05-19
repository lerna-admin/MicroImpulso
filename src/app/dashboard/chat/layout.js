import * as React from "react";
import { getUser } from "@/lib/custom-auth/server";
import { ChatProvider } from "@/components/dashboard/chat/chat-context";
import { ChatView } from "@/components/dashboard/chat/chat-view";
import { getAllConversationsByAgent } from "./hooks/use-conversations";
import { headers } from "next/headers";

function extractUuid(text) {
	const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
	const match = text.match(uuidRegex);
	return match ? match[0] : null;
}

export default async function Layout({ children }) {
	const {
		data: { user },
	} = await getUser();

	const resp = await getAllConversationsByAgent(user.id);
	const contacts = resp.map(({ client }) => ({ id: client.id, name: client.name }));

	let threadCounter = 1;

	// ✅ Construir el absolute URL del host actual usando headers
	const headersList = await headers();
	const host = headersList.get("host");
	const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
	const url = `${protocol}://${host}/dashboard/api/routes`;

	const routesRes = await fetch(url, {
		headers: {
			cookie: headersList.get("cookie") || "", // 👈 importante para evitar redirección al login
		},
	});

	const contentType = routesRes.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		const fallback = await routesRes.text();
		console.error("❌ Expected JSON, got:", fallback.slice(0, 200));
		throw new Error("Invalid JSON response from /dashboard/api/routes");
	}

	const routes = await routesRes.json();
	const baseUrl = routes.appUrl || `${protocol}://${host}`;

	// ✅ Generar mensajes enriquecidos con link si aplica
	const messages = resp.flatMap((entry) => {
		const threadId = `TRD-${String(threadCounter++).padStart(3, "0")}`;

		return entry.messages.map((msg) => {
			const uuid = extractUuid(msg.content);

			return {
				id: msg.id,
				threadId: threadId,
				type: "text",
				content: uuid ? (
					<a
						href={`${baseUrl}/dashboard/documents/${uuid}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						Documento recibido
					</a>
				) : (
					msg.content
				),
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

	return (
		<ChatProvider contacts={contacts} messages={messages} threads={threads}>
			<ChatView>{children}</ChatView>
		</ChatProvider>
	);
}
