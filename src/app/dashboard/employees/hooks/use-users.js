const BASE_URL = process.env.BASE_URL;

export async function getAllCustomers() {
	const res = await fetch(`${BASE_URL}/clients`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

export async function getCustomersByAgent(id) {
	const res = await fetch(`${BASE_URL}/clients/agent/${id}`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

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

export async function updateCustomer(data) {
	const res = await fetch(`${BASE_URL}/clients/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar cliente");
	return { data: res.json(), status: res.status };
}
