/**
 * @typedef {Object} Request
 * @property {string} fullName
 * @property {string} state
 * @property {Date} createdAt
 * @property {string} amount
 * @property {string} documentId
 * @property {number} id
 */

const BASE_URL = process.env.BASE_URL;

/**
 *
 * @returns {Request[]}
 */


export async function getRequestsByAgent(id) {
	const res = await fetch(`${BASE_URL}/loan-request/agent/${id}`);
	if (!res.ok) throw new Error("Error al obtener solicitudes");
	return res.json();
}

export async function getAllRequests() {
	const res = await fetch(`${BASE_URL}/loan-request`);
	if (!res.ok) throw new Error("Error al obtener solicitudes");
	return res.json();
}

export async function getRequestById(id) {
	const res = await fetch(`${BASE_URL}/loan-request/${id}`);
	if (!res.ok) throw new Error("Solicitud no encontrada");
	return res.json();
}

export async function createRequest(data) {
	const res = await fetch(`${BASE_URL}/loan-request`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear solicitud");
	return res.json();
}

export async function updateRequest(data) {
	const res = await fetch(`${BASE_URL}/loan-request/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar solicitud");
	return { data: res.json(), status: res.status };
}
