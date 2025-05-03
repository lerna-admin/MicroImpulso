import * as React from "react";
import { redirect } from "next/navigation";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { getUser } from "@/lib/custom-auth/server";
import { logger } from "@/lib/default-logger";
import { SignInForm } from "@/components/auth/custom/sign-in-form";
import { CenteredLayout } from "@/components/auth/centered-layout";

export const metadata = { title: `Iniciar sesión | ${appConfig.name}` };

export default async function Page() {
	const { data } = await getUser();

	if (data?.user) {
		logger.debug("[Sign in] User is authenticated, redirecting to dashboard");
		redirect(paths.dashboard.overview);
	}

	return (
		<CenteredLayout>
			<SignInForm />
		</CenteredLayout>
	);
}
