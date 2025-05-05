import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { document, password } = await req.json();

		// Llamar al backend real para autenticación
		const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ document, password }),
		});

		if (!response.ok) {
			const { message } = await response.json();
			return NextResponse.json({ error: message || "Login failed" }, { status: 401 });
		}

		const { token, user } = await response.json();

		// Crear respuesta y setear cookie HttpOnly
		const res = NextResponse.json({ success: true, user });

		res.cookies.set("access_token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 día
		});

		return res;
	} catch (err) {
		console.error("[api/auth/login] Error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
