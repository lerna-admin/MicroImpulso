const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getClosingSummaryByAgent(agentId) {
	const res = await fetch(`${BASE_URL}/loan-request/agent/${agentId}/closing-summary`);
	if (!res.ok) throw new Error("Error al obtener cierre de ruta");
	return res.json();
}

export async function closeDay(agentId) {
	const res = await fetch(`${BASE_URL}/closing/agent/${agentId}/close-day`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	const data = await res.json();
	return data;
}
