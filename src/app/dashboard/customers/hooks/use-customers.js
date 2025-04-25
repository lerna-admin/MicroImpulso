const BASE_URL = process.env.API_URL || "https://680349a90a99cb7408eb8c47.mockapi.io/customers";

export async function getCustomers() {
	const res = await fetch(`${BASE_URL}`);
	if (!res.ok) throw new Error("Error al obtener clientes");
	return res.json();
}

export async function getCustomerById(id) {
	const res = await fetch(`${BASE_URL}/${id}`);
	if (!res.ok) throw new Error("Cliente no encontrado");
	return res.json();
}

export async function createCustomer(data) {
	const res = await fetch(`${BASE_URL}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear cliente");
	return res.json();
}

export async function updateCustomer(data) {
	const res = await fetch(`${BASE_URL}/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar cliente");
	return { data: res.json(), status: res.status };
}

export async function deleteCustomer(id) {
	const res = await fetch(`${BASE_URL}/${id}`);
	if (!res.ok) throw new Error("Error al borrar cliente");
	return res.json();
}
