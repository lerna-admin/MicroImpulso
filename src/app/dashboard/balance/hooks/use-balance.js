const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const noStore = { cache: "no-store" };

export async function getClosingSummaryByAgent(agentId) {
	const res = await fetch(`${BASE_URL}/loan-request/agent/${agentId}/closing-summary`, noStore);
	if (!res.ok) throw new Error("Error al obtener cierre de ruta");
	return await res.json();
}

export async function getDailyTrace(agentId, date) {
	const res = await fetch(`${BASE_URL}/cash/daily-trace/by-user/${agentId}?date=${date}`, noStore);
	if (!res.ok) throw new Error("Error al obtener cierre de ruta");
	return await res.json();
}

export async function getDailyTraceDetailed(agentId, date) {
	const res = await fetch(`${BASE_URL}/cash/export-daily-trace/?userId=${agentId}&date=${date}`, noStore);
	if (!res.ok) throw new Error("Error al obtener descarga detalle cierre de ruta");
	return await res;
}

export async function closeDay(agentId) {
	const res = await fetch(`${BASE_URL}/closing/agent/${agentId}/close-day`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	if (data.statusCode === 400) throw new Error("El usuario ya cerro ruta");
	if (!res.ok) throw new Error("Error al cerrar la ruta");
	return data;
}

export async function unlockUser(agentId) {
	const res = await fetch(`${BASE_URL}/users/${agentId}/unblock`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();

	if (!res.ok) throw new Error("Error al desbloquear usuario");
	return data;
}

export async function activeUser(agentId, body) {
	const res = await fetch(`${BASE_URL}/users/${agentId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	const data = await res.json();

	if (!res.ok) throw new Error("Error al desbloquear usuario");
	return data;
}

export async function deleteCloseDay(agentId) {
	const res = await fetch(`${BASE_URL}/closing/agent/${agentId}/close-day`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	return await res.json();
}
