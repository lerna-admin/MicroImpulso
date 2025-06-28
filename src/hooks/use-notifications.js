const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getNotificationsByUser(userId) {
	const res = await fetch(`${BASE_URL}/notifications/${userId}`);
	if (!res.ok) throw new Error("Error al obtener notificaciones por usuario");
	return await res.json();
}

export async function markAsReadNotification(notificationId) {
	const res = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	if (!res.ok) throw new Error("Error al actualizar la notificacion");
	return await res.json();
}
