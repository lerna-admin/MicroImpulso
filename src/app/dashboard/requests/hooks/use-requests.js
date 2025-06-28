/**
 * @typedef {Object} Request
 * @property {string} fullName
 * @property {string} state
 * @property {Date} createdAt
 * @property {string} amount
 * @property {string} documentId
 * @property {number} id
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 *
 * @returns {Request[]}
 */
export async function getAllRequests({ page = 1, limit = 10, status = "", branchId }) {
	const res = await fetch(`${BASE_URL}/loan-request?page=${page}&limit=${limit}&status=${status}&branchId=${branchId}`);
	if (!res.ok) throw new Error("Error al obtener solicitudes");
	return await res.json();
}

/**
 *
 * @returns {Request[]}
 */
export async function getRequestsByAgent(id, { page = 1, limit = 10, status = "" }) {
	const res = await fetch(`${BASE_URL}/loan-request/agent/${id}?page=${page}&limit=${limit}&status=${status}`);
	if (!res.ok) throw new Error("Error al obtener solicitudes");
	return await res.json();
}

export async function getRequestsByCustomerId(id) {
	const res = await fetch(`${BASE_URL}/loan-request/client/${id}`);
	if (!res.ok) throw new Error("Error al obtener solicitud por client id");
	return await res.json();
}

export async function getAllRequestsByCustomerId(id) {
	const res = await fetch(`${BASE_URL}/loan-request/client/${id}/all`);
	if (!res.ok) throw new Error("Error al obtener todas las solicitudes por client id");
	return await res.json();
}

/**
 *
 * @returns {Request}
 */
export async function getRequestById(id) {
	const res = await fetch(`${BASE_URL}/loan-request/${id}`);
	if (!res.ok) throw new Error("Solicitud no encontrada");
	return await res.json();
}

export async function createRequest(data) {
	const res = await fetch(`${BASE_URL}/loan-request`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear solicitud");
	return await res.json();
}

export async function updateRequest(data, id) {
	const res = await fetch(`${BASE_URL}/loan-request/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar solicitud");
	return await res.json();
}

export async function renewRequest(data, id) {
	const res = await fetch(`${BASE_URL}/loan-request/${id}/renew`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar solicitud");
	return await res.json();
}

export async function sendContract(loanRequestId) {
	const res = await fetch(`${BASE_URL}/loan-request/${loanRequestId}/send-contract`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Error al enviar contrato");
	return await res.json();
}
