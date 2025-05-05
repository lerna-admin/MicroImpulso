// src/app/api/auth/get-user/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET() {
	const token = cookies().get("access_token")?.value;

	if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

	try {
		const decoded = jwtDecode(token);
		return NextResponse.json({ user: decoded });
	} catch (error) {
		return NextResponse.json({ error: "Invalid token", details: error }, { status: 400 });
	}
}
