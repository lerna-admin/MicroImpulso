/**
 * @typedef {Object} Customer
 * @property {string} fullName
 * @property {string} phoneNumber
 * @property {string} email
 * @property {string} state
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {string} address
 * @property {string} amountTaken
 * @property {string} documentId
 * @property {number} id
 */

const BASE_URL = process.env.API_URL || "https://680349a90a99cb7408eb8c47.mockapi.io";

/**
 *
 * @returns {Customer[]}
 */
export async function getCustomers(page = 1, limit = 10) {
	const res = await fetch(`${BASE_URL}/customers?page=${page}&limit=${limit}`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

export async function getCustomerById(id) {
	const res = await fetch(`${BASE_URL}/customers/${id}`);
	if (!res.ok) throw new Error("Cliente no encontrado");
	return res.json();
}

export async function createCustomer(data) {
	const res = await fetch(`${BASE_URL}/customers`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear cliente");
	return res.json();
}

export async function updateCustomer(data) {
	const res = await fetch(`${BASE_URL}/customers/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar cliente");
	return { data: res.json(), status: res.status };
}
