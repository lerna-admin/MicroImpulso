const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRequestsStatsBranchesCurrentMonth() {
	const res = await fetch(`${BASE_URL}/stats/branches/current-month`);
	if (!res.ok) throw new Error("Error al obtener solicitudes por sede por mes actual");
	return res.json();
}

export async function getRequestsStatsBranchesMonthlyHistory() {
	const res = await fetch(`${BASE_URL}/stats/branches/monthly-history`);
	if (!res.ok) throw new Error("Error al obtener solicitudes historicamente por mes");
	return res.json();
}

export async function getRequestsStatsClientsSummary() {
	const res = await fetch(`${BASE_URL}/stats/clients/summary`);
	if (!res.ok) throw new Error("Error al obtener resumen de clientes");
	return res.json();
}

export async function getManagerSummary() {
	const res = await fetch(`${BASE_URL}/stats/manager-summary`);
	if (!res.ok) throw new Error("Error al obtener resumen de clientes");
	return res.json();
}
