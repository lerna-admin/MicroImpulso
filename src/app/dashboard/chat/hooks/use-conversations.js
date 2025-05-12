const BASE_URL = process.env.BASE_URL;

export async function getAllConversationsByAgent(id) {
	const res = await fetch(`${BASE_URL}/chat/agent/${id}/conversations`);
	if (!res.ok) throw new Error("Error al obtener conversaciones");
	return res.json();
}
