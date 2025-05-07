import "server-only";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function getUser() {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token")?.value;

	if (!token) {
		return { data: { user: null } };
	}

	const decoded = jwtDecode(token);
	const { user } = decoded;

	return { data: { user } };
}
