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
		// Asegurar que BASE_URL tenga formato correcto
		let baseUrl = process.env.BASE_URL || "";
		if (!baseUrl.startsWith("http")) {
			baseUrl = `http://${baseUrl}`;
		}

		const response = await fetch(`${baseUrl}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ document, password }),
			cache: "no-store",
		});

		if (!response.ok) {
			const { message } = await response.json();
			return { error: message || "Login failed" };
		}

		const { token } = await response.json();
		const { user, closedRoute } = jwtDecode(token);

		const cookieStore = await cookies();
		cookieStore.set("access_token", token, {
			path: "/",
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24,
		});
		cookieStore.set("isAgentClosed", String(closedRoute), {
			path: "/",
			httpOnly: false,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24,
		});

		return { data: user };
	} catch (error) {
		console.error("[signInWithApi] Error:", error);
		return { error: "Unexpected error occurred" };
	}
}
