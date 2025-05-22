// app/api/chat/conversations/route.ts
import { NextRequest } from "next/server";
import { getAllConversationsByAgent } from "@/app/dashboard/chat/hooks/use-conversations"; 
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const agentId = searchParams.get("agentId");

	if (!agentId) {
		return new Response("Missing agentId", { status: 400 });
	}

	const conversations = await getAllConversationsByAgent(+agentId);
	return Response.json(conversations);
}