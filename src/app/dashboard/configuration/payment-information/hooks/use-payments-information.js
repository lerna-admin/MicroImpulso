const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createPaymentInformation(data) {
	const res = await fetch(`${BASE_URL}/payment-accounts`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al crear una cuenta de pago");
	return await res.json();
}

export async function getAllPaymentsInformation() {
	const res = await fetch(`${BASE_URL}/payment-accounts`);
	if (!res.ok) throw new Error("Error al obtener todas las cuentas de pago");
	return await res.json();
}

export async function deletePaymentInformation(id) {
	const res = await fetch(`${BASE_URL}/payment-accounts/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Error al borrar una cuenta de pago");
	return await res.json();
}

export async function editPaymentInformation(id, data) {
	const res = await fetch(`${BASE_URL}/payment-accounts/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error("Error al editar una cuenta de pago");
	return await res.json();
}
