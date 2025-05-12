import "server-only";

import { NextResponse } from "next/server";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { getAppUrl } from "@/lib/get-app-url";

import { getProtectedRoutes } from "../get-role-permissions";
import { getUser } from "./server";

const routePermissions = getProtectedRoutes();

export async function middleware(req) {
	const res = NextResponse.next({ request: req });
	const { data } = await getUser();

	if (req.nextUrl.pathname.startsWith("/privacy") && req.nextUrl.pathname.startsWith("/dashboard") && !data?.user) {
		logger.debug("[Middleware] User is not logged in, redirecting to sign in");
		const redirectTo = new URL(paths.auth.signIn, getAppUrl());
		return NextResponse.redirect(redirectTo);
	}

	for (const [protectedPath, allowedRoles] of Object.entries(routePermissions)) {
		if (req.nextUrl.pathname.startsWith(protectedPath) && !allowedRoles.includes(data.user.role.toLowerCase())) {
			return NextResponse.redirect(new URL(paths.notAuthorized, req.url));
		}
	}

	return res;
}
