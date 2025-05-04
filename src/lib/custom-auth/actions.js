"use server";

import { cookies } from "next/headers";

import { user } from "./data";

function generateToken() {
	const arr = new Uint8Array(12);
	globalThis.crypto.getRandomValues(arr);
	return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
}

export async function signUp(_) {
	// Store the user in the database
	const token = generateToken();
	const cookieStore = await cookies();
	cookieStore.set("access_token", token);

	return { data: { user } };
}

export async function signInWithOAuth(_) {
	return { error: "Social authentication not implemented" };
}

export async function signInWithPassword(params) {
	const { email, password } = params;

	// We hardcode the credentials for the simplicity of the example
	if (email !== "sofia@devias.io" || password !== "Secret1") {
		return { error: "Invalid credentials" };
	}

	const token = generateToken();
	const cookieStore = await cookies();
	cookieStore.set("access_token", token);

	return { data: { user } };
}

export async function resetPassword(_) {
	return { error: "Password reset not implemented" };
}

export async function updatePassword(_) {
	return { error: "Update reset not implemented" };
}

export async function signOut() {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");

	return {};
}

export async function signInWithApi({ document, password }) {
	console.log(document, password)
	const apiUrl = process.env.API_URL;

	try {
	  const response = await fetch(`http://localhost:3100/auth/login`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ document, password }),
		cache: 'no-store',
	  });
  
	  // Error del backend (como 401)
	  if (!response.ok) {
		const { message } = await response.json();
		return { error: message || 'Login failed' };
	  }
  
	  const { token, role } = await response.json();
  
	  const cookieStore = cookies();
  
	  // 🔐 Token JWT (solo accesible por el servidor)
	  cookieStore.set('access_token', token, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24, // 1 día
	  });
  
	  // 🔓 Rol (puedes decidir si quieres que sea accesible desde el cliente)
	
	  console.log(token )
	  return { data: { token } };
	} catch (err) {
	  console.error('[signInWithApi] Error:', err);
	  return { error: 'Unexpected error occurred' };
	}
  }