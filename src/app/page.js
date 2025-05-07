import { redirect } from "next/navigation";

import { getUser } from "@/lib/custom-auth/server";

export default async function Home() {
	const { data } = await getUser();
	if (data?.user) {
		redirect("/dashboard");
	} else {
		redirect("/auth/sign-in");
	}
}
