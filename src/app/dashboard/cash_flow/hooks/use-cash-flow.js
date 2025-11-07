import { dayjs } from "@/lib/dayjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashFlowSummary(userId, date = dayjs().format("YYYY-MM-DD")) {
	const res = await fetch(`${BASE_URL}/cash/daily?userId=${userId}&date=${date}`);
	if (!res.ok) throw new Error("Error al obtener resumen de movimientos de caja");
	return await res.json();
}

export async function getCashMovements(
	branchId,
	search = "",
	page = 1,
	limit = 10,
	date = dayjs().format("YYYY-MM-DD")
) {
	const res = await fetch(
		`${BASE_URL}/cash?search=${search}&branchId=${branchId}&date=${date}&page=${page}&limit=${limit}`
	);
	if (!res.ok) throw new Error("Error al obtener movimientos de caja");
	return await res.json();
}

export async function getDailyStatisticsDetailed(id, date) {
	const res = await fetch(`${BASE_URL}/cash/export-statistics?userId=${id}&date=${date}`);
	if (!res.ok) throw new Error("Error al obtener descarga detalle");
	return await res;
}

export async function deleteCashMovement(id) {
	const res = await fetch(`${BASE_URL}/cash/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Error al borrar un movimiento de caja");
	return await res.json();
}

export async function createCashMovement(data) {
	const res = await fetch(`${BASE_URL}/cash`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear movimiento");
	return await res.json();
}
