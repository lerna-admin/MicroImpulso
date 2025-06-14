import { dayjs } from "@/lib/dayjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashFlowSummary(branchId, date = dayjs().format("YYYY-MM-DD")) {
	const res = await fetch(`${BASE_URL}/cash/summary?branchId=${branchId}&date=${date}`);
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

export async function createCashMovement(data) {
	const res = await fetch(`${BASE_URL}/cash`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear movimiento");
	return await res.json();
}
