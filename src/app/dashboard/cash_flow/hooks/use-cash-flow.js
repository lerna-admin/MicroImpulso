import { dayjs } from "@/lib/dayjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashFlowSummary(userId, date = dayjs().format("YYYY-MM-DD")) {
	const url = `${BASE_URL}/cash/daily?userId=${userId}&date=${date}`;
	console.log("[CashFlow] getCashFlowSummary → requesting", { userId, date, url });
	const res = await fetch(url);
	console.log("[CashFlow] getCashFlowSummary ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] getCashFlowSummary error response body", await res.text());
		throw new Error("Error al obtener resumen de movimientos de caja");
	}
	const payload = await res.json();
	console.log("[CashFlow] getCashFlowSummary ← payload", payload);
	return payload;
}

export async function getCashMovements(
	branchId,
	search = "",
	page = 1,
	limit = 10,
	date = dayjs().format("YYYY-MM-DD")
) {
	const url = `${BASE_URL}/cash?search=${search}&branchId=${branchId}&date=${date}&page=${page}&limit=${limit}`;
	console.log("[CashFlow] getCashMovements → requesting", {
		branchId,
		search,
		page,
		limit,
		date,
		url,
	});
	const res = await fetch(url);
	console.log("[CashFlow] getCashMovements ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] getCashMovements error response body", await res.text());
		throw new Error("Error al obtener movimientos de caja");
	}
	const payload = await res.json();
	console.log("[CashFlow] getCashMovements ← payload summary", {
		total: payload?.total,
		page: payload?.page,
		limit: payload?.limit,
		dataCount: Array.isArray(payload?.data) ? payload.data.length : undefined,
	});
	return payload;
}

export async function getDailyStatisticsDetailed(id, date) {
	const url = `${BASE_URL}/cash/export-statistics?userId=${id}&date=${date}`;
	console.log("[CashFlow] getDailyStatisticsDetailed → requesting", { id, date, url });
	const res = await fetch(url);
	console.log("[CashFlow] getDailyStatisticsDetailed ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] getDailyStatisticsDetailed error response body", await res.text());
		throw new Error("Error al obtener descarga detalle");
	}
	return await res;
}

export async function deleteCashMovement(id) {
	console.log("[CashFlow] deleteCashMovement → sending", { id });
	const res = await fetch(`${BASE_URL}/cash/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	console.log("[CashFlow] deleteCashMovement ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] deleteCashMovement error body", await res.text());
		throw new Error("Error al borrar un movimiento de caja");
	}
	return await res.json();
}

export async function createCashMovement(data) {
	console.log("[CashFlow] createCashMovement → sending", data);
	const res = await fetch(`${BASE_URL}/cash`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	console.log("[CashFlow] createCashMovement ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] createCashMovement error body", await res.text());
		throw new Error("Error al crear movimiento");
	}
	const payload = await res.json();
	console.log("[CashFlow] createCashMovement ← payload", payload);
	return payload;
}

export async function updateCashMovementAmount(id, amount) {
	console.log("[CashFlow] updateCashMovementAmount → sending", { id, amount });
	const res = await fetch(`${BASE_URL}/cash/${id}/amount`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ amount }),
	});
	console.log("[CashFlow] updateCashMovementAmount ← response meta", {
		status: res.status,
		ok: res.ok,
		statusText: res.statusText,
	});
	if (!res.ok) {
		console.error("[CashFlow] updateCashMovementAmount error body", await res.text());
		throw new Error("Error al actualizar el monto del movimiento de caja");
	}
	const payload = await res.json();
	console.log("[CashFlow] updateCashMovementAmount ← payload", payload);
	return payload;
}
