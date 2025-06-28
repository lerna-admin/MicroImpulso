const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllUsers({ page = 1, limit = 10, branchId = "", name = "", document = "", role = "" }) {
	const params = new URLSearchParams();

	params.append("page", page.toString());
	params.append("limit", limit.toString());

	if (branchId) params.append("branchId", branchId);
	if (name) params.append("name", name);
	if (document) params.append("document", document);
	if (role) params.append("role", role);

	const url = `${BASE_URL}/users?${params.toString()}`;
	const res = await fetch(url);

	if (!res.ok) throw new Error("Error al obtener usuarios");
	return await res.json();
}

export async function getUserById(id) {
	const res = await fetch(`${BASE_URL}/users/${id}`);
	if (!res.ok) throw new Error("Usuario no encontrado");
	return await res.json();
}

export async function createUser(data) {
	const res = await fetch(`${BASE_URL}/users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear usuario");
	return await res.json();
}

export async function updateUser(data) {
	const res = await fetch(`${BASE_URL}/users/${data.id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar usuario");
	return await res.json();
}
