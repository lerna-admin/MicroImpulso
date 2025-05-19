const BASE_URL = process.env.BASE_URL;

export async function getDocumentById(id) {
	const res = await fetch(`${BASE_URL}/documents/${id}`);
	if (!res.ok) throw new Error("Error al obtener documento");
	return res.json();
}

export function parseUrl(url) {
	return `${BASE_URL}${url}`;
}

export function parseUrlFile(url) {
    console.log(BASE_URL);
    
	return `${BASE_URL}/documents/${url}/file`;
}
