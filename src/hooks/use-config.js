const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateConfigParam(key, value) {
	const res = await fetch(`${BASE_URL}/config/${key}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(value),
	});
	if (!res.ok) throw new Error("Error al actualizar ese parametro");
	return await res.json();
}

export async function getAllConfigParams() {
	const res = await fetch(`${BASE_URL}/config`);
	if (!res.ok) throw new Error("Error al obtener los parametros");
	return await res.json();
}

export async function getConfigParamsByKey(key) {
	const res = await fetch(`${BASE_URL}/config/${key}`);
	if (!res.ok) throw new Error("Error al obtener los parametros por llave");
	return await res.json();
}
