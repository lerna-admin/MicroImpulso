const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllBranches() {
    const res = await fetch(`${BASE_URL}/branches`);
    if (!res.ok) throw new Error("Error al obtener sedes");
    return await res.json();
}