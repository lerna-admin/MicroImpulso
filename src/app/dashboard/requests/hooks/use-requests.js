/**
 * @typedef {Object} Request
 * @property {string} fullName
 * @property {string} state
 * @property {Date} createdAt
 * @property {string} amount
 * @property {string} documentId
 * @property {number} id
 */

const BASE_URL = process.env.API_URL || "https://680349a90a99cb7408eb8c47.mockapi.io";

/**
 *
 * @returns {Request[]}
 */
export async function getRequests(page = 1, limit = 10) {
	const res = await fetch(`${BASE_URL}/requests?page=${page}&limit=${limit}`);
	if (!res.ok) throw new Error("Error al obtener solicitudes");
	return res.json();
}

export async function getRequestById(id) {
	const res = await fetch(`${BASE_URL}/requests/${id}`);
	if (!res.ok) throw new Error("Solicitud no encontrada");
	return res.json();
}

export async function createRequest(data) {
	const res = await fetch(`${BASE_URL}/requests`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear solicitud");
	return res.json();
}

export async function updateRequest(data) {
	const res = await fetch(`${BASE_URL}/requests/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar solicitud");
	return { data: res.json(), status: res.status };
}
