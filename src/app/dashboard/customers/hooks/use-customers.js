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
export async function getAllCustomers({
	page = 1,
	limit = 10,
	status = "",
	type = "",
	paymentDay = "",
	name = "",
	branch = "",
	agent = "",
}) {
	const params = new URLSearchParams();

	params.append("page", page.toString());
	params.append("limit", limit.toString());

	if (status) params.append("status", status);
	if (type) params.append("type", type);
	if (paymentDay) params.append("paymentDay", paymentDay);
	if (name) params.append("name", name);
	if (branch) params.append("branch", branch);
	if (agent) params.append("agent", agent);

	const url = `${BASE_URL}/clients?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener clientes");
	return await res.json();
}

export async function getAllCustomersByQuery(query) {
	const params = new URLSearchParams();

	params.append("q", query.toString());

	const url = `${BASE_URL}/clients/query?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener clientes");
	return await res.json();
}



/**
 *
 * @returns {Client[]}
 */
export async function getAllCustomersByAgent({
	page = 1,
	limit = 10,
	status = "",
	type = "",
	paymentDay = "",
	name = "",
	branch = "",
	agent = "",
}) {
	const params = new URLSearchParams();

	params.append("page", page.toString());
	params.append("limit", limit.toString());

	if (status) params.append("status", status);
	if (type) params.append("type", type);
	if (paymentDay) params.append("paymentDay", paymentDay);
	if (name) params.append("name", name);
	if (branch) params.append("branch", branch);
	if (agent) params.append("agent", agent);

	const url = `${BASE_URL}/clients/${agent}?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener clientes");
	return await res.json();
}


// /**
//  *
//  * @returns {Client[]}
//  */
// export async function getCustomersByAgent(id, { page = 1, limit = 10, status = "", type = "", paymentDay = "" }) {
// 	const res = await fetch(
// 		`${BASE_URL}/clients/agent/${id}?page=${page}&limit=${limit}&status=${status}&type=${type}&paymentDay=${paymentDay}`
// 	);
// 	if (!res.ok) throw new Error("Error al obtener clientes por agente");
// 	return res.json();
// }

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
	return await res.json();
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
