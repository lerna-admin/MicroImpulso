import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;

export async function POST(request) {
	try {
		const body = await request.json();
		const { clientId, message } = body;

		if (!clientId || !message) {
			return NextResponse.json({ error: "clientId and message are required" }, { status: 400 });
		}

		const res = await fetch(`${BASE_URL}/chat/send/${clientId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message: message }),
		});
		if (!res.ok) throw new Error("Error al enviar mensaje");

		// Aquí puedes hacer lo que necesites con los datos
		return NextResponse.json(res);
	} catch (error) {
        console.log(error);
        
		return NextResponse.json({ error: error }, { status: 400 });
	}
}
