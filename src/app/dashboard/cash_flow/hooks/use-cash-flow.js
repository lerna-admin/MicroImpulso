import { dayjs } from "@/lib/dayjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCashMovements(branchId, { page = 1, limit = 10 }) {
	const res = await fetch(`${BASE_URL}/cash?branchId=${branchId}&page=${page}&limit=${limit}`);
	if (!res.ok) throw new Error("Error al obtener movimientos de caja");
	return res.json();
}

export async function getCashFlowSummary(branchId, date = new dayjs()) {
	const res = await fetch(`${BASE_URL}/cash/summary?branchId=${branchId}&date=${date}`);
	if (!res.ok) throw new Error("Error al obtener resumen de movimientos de caja");
	return res.json();
}

// export async function createCashMovement(data) {
// 	const res = await fetch(`${BASE_URL}/cash`, {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify(data),
// 	});
// 	if (!res.ok) throw new Error("Error al crear movimiento");
// 	return { data: res.json(), status: res.status };
// }

export async function createCashMovement(data) {
	const res = await fetch(`${BASE_URL}/cash`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	const json = await res.json();

	if (!res.ok) throw new Error("Error al crear movimiento");

	return { data: json, status: res.status };
}
