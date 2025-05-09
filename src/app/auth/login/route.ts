// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { document, password } = await req.json();

		const response = await fetch(`${process.env.BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ document, password }),
		});

		if (!response.ok) {
			const { message } = await response.json();
			return NextResponse.json({ error: message || "Login failed" }, { status: 401 });
		}

		const { token } = await response.json();

		// ✅ Set cookie using NextResponse
		const res = NextResponse.json({ success: true });
		res.cookies.set("access_token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: false,
			path: "/",
			maxAge: 60 * 60 * 24,
		});

		return res;
	} catch (err) {
		console.error("[api/auth/login] Error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}


