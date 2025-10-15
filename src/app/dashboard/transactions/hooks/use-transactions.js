const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTransaction(data) {
	const res = await fetch(`${BASE_URL}/transactions`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	const response = await res.json();
	
	if (!res.ok) throw new Error(response.message);
	return await response;
}
