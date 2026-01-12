const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDailyCashSummary({ date = "", userId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/finance/daily-cash?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getDailyCashCountPerAgent({ date = "", userId = "", branchId = "", agentId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);
	if (branchId) params.append("branchId", branchId);
	if (agentId) params.append("agentId", agentId);

	const url = `${BASE_URL}/reports/finance/daily-cash-count?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getActiveLoansByStatus({ date = "", userId = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (date) params.append("date", date);
	if (userId) params.append("userId", userId);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/loans/active-status?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getUpcomingDues({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/loans/upcoming-dues?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getOverdueLoans({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/loans/overdue?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getCompletedRenewals({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/loans/renewals?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getLoanHistoryByClient({ userId = "", clientId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (clientId) params.append("clientId", clientId);

	const url = `${BASE_URL}/reports/clients/loans-history?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getNewClientsByDateRange({ userId = "", startDate = "", endDate = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);

	const url = `${BASE_URL}/reports/clients/new?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getActiveVsInactiveClients({ userId = "", branchId = "", agentId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (branchId) params.append("branchId", branchId);
	if (agentId) params.append("agentId", agentId);

	const url = `${BASE_URL}/reports/clients/active-inactive?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getTotalLoanAmount({ userId = "", startDate = "", endDate = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/finance/total-loaned?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getTotalCollectionReceived({ userId = "", startDate = "", endDate = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/finance/total-collected?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getDocumentsUploadedByClient({
	userId = "",
	startDate = "",
	endDate = "",
	clientId = "",
	docType = "",
}) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (clientId) params.append("clientId", clientId);
	if (docType) params.append("docType", docType);

	const url = `${BASE_URL}/reports/clients/documents?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getAgentActivity({ userId = "", startDate = "", endDate = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/agents/activity?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getAverageApprovalTime({ userId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);

	const url = `${BASE_URL}/reports/agents/approval-time?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getGeneralCashFlow({ userId = "", startDate = "", endDate = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);

	const url = `${BASE_URL}/reports/finance/cash-flow?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getTransactionDetails({ userId = "", startDate = "", endDate = "", branchId = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (branchId) params.append("branchId", branchId);

	const url = `${BASE_URL}/reports/finance/transactions?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}

export async function getGeneralStatisticsByBranch({ userId = "", startDate = "", endDate = "" }) {
	const params = new URLSearchParams();

	if (userId) params.append("userId", userId);
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);

	const url = `${BASE_URL}/reports/finance/branch-stats?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener este reporte");
	return await res.json();
}
