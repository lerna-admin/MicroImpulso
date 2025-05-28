/**
 * @typedef {Object} Client
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {string} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 *
 * @returns {Client[]}
 */
export async function getAllCustomers({ page = 1, limit = 10 }) {
	console.log(`${BASE_URL}/clients?page=${page}&limit=${limit}`);

	const res = await fetch(`${BASE_URL}/clients?page=${page}&limit=${limit}`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

/**
 *
 * @returns {Client[]}
 */
export async function getCustomersByAgent(id) {
	const res = await fetch(`${BASE_URL}/clients/agent/${id}`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

/**
 *
 * @returns {Client}
 */
export async function getCustomerById(id) {
	const res = await fetch(`${BASE_URL}/clients/${id}`);
	if (!res.ok) throw new Error("Cliente no encontrado");
	return res.json();
}

export async function createCustomer(data) {
	const res = await fetch(`${BASE_URL}/clients`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear cliente");
	return res.json();
}

export async function updateCustomer(data, id) {
	const res = await fetch(`${BASE_URL}/clients/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar cliente");
	return { data: res.json(), status: res.status };
}
