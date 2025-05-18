// src/app/api/documents/[documentId]/route.ts

import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { documentId } =await  context.params;

  try {
    const res = await fetch(`http://localhost:3100/documents/${documentId}`);
    if (!res.ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
