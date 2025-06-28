// app/api/chat/conversations/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	
	return Response.json(conversations);
}