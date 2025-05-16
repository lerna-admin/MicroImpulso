import * as React from "react";
import { redirect } from "next/navigation";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { getFirstRolePath } from "@/lib/get-role-permissions";

export const metadata = { title: `Dashboard | ${appConfig.name}` };

export default async function Page() {
	const { data } = await getUser();

	if (data?.user) {
		const firstPath = getFirstRolePath(data.user.role);
		redirect(firstPath);
	}
	return <></>;
}
