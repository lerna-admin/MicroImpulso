const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPermissions() {
	const res = await fetch(`${BASE_URL}/permission`);
	if (!res.ok) throw new Error("Error al obtener todos los permisos");
	return await res.json();
}

export async function createPermission(data) {
	const res = await fetch(`${BASE_URL}/permission/create`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear permiso");
	return await res.json();
}

export async function savePermission(userId, data) {
	const res = await fetch(`${BASE_URL}/permission/assign/${userId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al guardar permiso al usuario");
	return await res.json();
}

