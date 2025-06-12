const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllUsers({ page = 1, limit = 10, branchId = "", name = "", document = "" }) {
	const res = await fetch(
		`${BASE_URL}/users?page=${page}&limit=${limit}&branchId${branchId}&name=${name}&document=${document}`
	);
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
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar usuario");
	return await res.json();
}
