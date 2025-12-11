const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllConversationsByAgent(id) {
	const res = await fetch(`${BASE_URL}/chat/agent/${id}/conversations`);
	if (!res.ok) throw new Error("Error al obtener conversaciones");
	return res.json();
}

export async function sendMessageToClient(message, clientId) {
	const res = await fetch(`${BASE_URL}/chat/send/${clientId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: message }),
	});
	if (!res.ok) throw new Error("Error al enviar mensaje");
	return res.json();
}

export async function sendSimulation(data) {
	const res = await fetch(`${BASE_URL}/chat/send-simulation`, {
		method: "POST",
		body: data,
	});
	if (!res.ok) throw new Error("Error al enviar simulación de credito ");
	return res.json();
}

export async function rejectClientLoan(clientId) {
	const loanRes = await fetch(`${BASE_URL}/loan-request/client/${clientId}`);
	if (!loanRes.ok) {
		throw new Error("No se encontró una solicitud abierta para este cliente");
	}
	const loan = await loanRes.json();
	const patchRes = await fetch(`${BASE_URL}/loan-request/${loan.id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ status: "rejected" }),
	});
	if (!patchRes.ok) {
		throw new Error("Error al marcar la solicitud como rechazada");
	}
	return patchRes.json();
}

export async function markClientMessagesAsRead(clientId) {
	const res = await fetch(`${BASE_URL}/chat/client/${clientId}/read`, {
		method: "POST",
	});
	if (!res.ok) throw new Error("Error al marcar mensajes como leídos");
	return res.json();
}

export async function sendAttachmentToClient(clientId, file) {
	const formData = new FormData();
	formData.append("file", file);
	const res = await fetch(`${BASE_URL}/chat/send-attachment/${clientId}`, {
		method: "POST",
		body: formData,
	});
	if (!res.ok) throw new Error("Error al enviar adjunto");
	return res.json();
}

const parseErrorResponse = async (res) => {
	try {
		const data = await res.json();
		return data?.message || data?.error || res.statusText || "Error desconocido";
	} catch {
		return res.statusText || "Error desconocido";
	}
};

export async function getClientLoanSnapshot(clientId) {
	if (!clientId) return null;
	const openRes = await fetch(`${BASE_URL}/loan-request/client/${clientId}`);
	if (openRes.ok) {
		return await openRes.json();
	}
	if (openRes.status === 404) {
		const historyRes = await fetch(`${BASE_URL}/loan-request/client/${clientId}/all`);
		if (!historyRes.ok) {
			return null;
		}
		const history = await historyRes.json();
		return Array.isArray(history) ? history[0] ?? null : null;
	}
	const message = await parseErrorResponse(openRes);
	throw new Error(message);
}
