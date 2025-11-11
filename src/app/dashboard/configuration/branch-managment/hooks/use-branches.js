const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createBranch(data) {
	const res = await fetch(`${BASE_URL}/branches`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear sede");
	return await res.json();
}

export async function getAllBranches(c_id=null) {
	let url = `${BASE_URL}/branches`;
	if(c_id){
		url+=`?countryId=${c_id}` 
	}

	const res = await fetch(url);
	if (!res.ok) throw new Error("Error al obtener sedes");
	return await res.json();
}

export async function getBranchesById(id) {
	const res = await fetch(`${BASE_URL}/branches/${id}`);
	if (!res.ok) throw new Error("Error al obtener sedes por id");
	return await res.json();
}
