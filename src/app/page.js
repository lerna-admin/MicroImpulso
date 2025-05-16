import { redirect } from "next/navigation";

import { getUser } from "@/lib/custom-auth/server";
import { getFirstRolePath } from "@/lib/get-role-permissions";

export default async function Home() {
	const { data } = await getUser();
	if (data?.user) {
		const firstPath = getFirstRolePath(data.user.role);
		redirect(firstPath);
	} else {
		redirect("/auth/sign-in");
	}
}
