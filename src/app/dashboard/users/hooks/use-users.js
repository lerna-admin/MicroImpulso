const BASE_URL = process.env.BASE_URL;

export async function getAllUsers() {
	const res = await fetch(`${BASE_URL}/users`);
	if (!res.ok) throw new Error("Error al obtener usuarios");
	return res.json();
}

export async function getUserById(id) {
	const res = await fetch(`${BASE_URL}/users/${id}`);
	if (!res.ok) throw new Error("Usuario no encontrado");
	return res.json();
}

export async function createUser(data) {
	const res = await fetch(`${BASE_URL}/users`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear usuario");
	return res.json();
}

export async function updateUser(data) {
	const res = await fetch(`${BASE_URL}/users/${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al actualizar usuario");
	return { data: res.json(), status: res.status };
}
