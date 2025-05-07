import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token")?.value;

	if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

	try {
		const decoded = jwtDecode(token);
		return NextResponse.json({ data: decoded });
	} catch (error) {
		return NextResponse.json({ error: "Invalid token", details: error }, { status: 400 });
	}
}
