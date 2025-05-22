const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllConversationsByAgent(id) {
	const res = await fetch(`${BASE_URL}/chat/agent/${id}/conversations`);
	if (!res.ok) throw new Error("Error al obtener conversaciones");
	return res.json();
}

export async function sendMessageToClient(message, clientId) {
	const res = await fetch(`${BASE_URL}/chat/send/${clientId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: message }),
	});
	if (!res.ok) throw new Error("Error al enviar mensaje");
	return res.json();
}

export async function sendSimulation(data) {
	const res = await fetch(`${BASE_URL}/chat/send-simulation`, {
		method: "POST",
		body: data,
	});
	if (!res.ok) throw new Error("Error al enviar simulación de credito ");
	return res.json();
}
