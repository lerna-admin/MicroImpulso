const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDailyCashSummary({ date = "", userId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/daily-cash?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getDailyCashCountPerAgent({ date = "", userId = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/daily-cash-count?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getActiveLoansByStatus({ date = "", userId = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/active-loans-status?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getUpcomingDues({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/upcoming-dues?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getOverdueLoans({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/overdue-loans?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getCompletedRenewals({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/renewals?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getLoanHistoryByClient({ userId = "", clientId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (clientId) params.append("clientId", clientId);

	const url = `${BASE_URL}/reports/client-loans-history?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}
