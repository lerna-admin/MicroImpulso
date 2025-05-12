"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function signOut() {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");

	return {};
}

export async function signInWithApi({ document, password }) {
	try {
		const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ document, password }),
			cache: "no-store",
		});

		// Error del backend (como 401)
		if (!response.ok) {
			const { message } = await response.json();
			return { error: message || "Login failed" };
		}

		const { token } = await response.json();
		const { user } = jwtDecode(token);

		const cookieStore = await cookies();

		// 🔐 Token JWT (solo accesible por el servidor)
		cookieStore.set("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 1 día
		});

		// 🔓 Rol (puedes decidir si quieres que sea accesible desde el cliente)

		return { data: user };
	} catch (error) {
		console.error("[signInWithApi] Error:", error);
		return { error: "Unexpected error occurred" };
	}
}
