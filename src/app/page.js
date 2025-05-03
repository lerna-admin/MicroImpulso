import { redirect } from "next/navigation";

import { getUser } from "@/lib/custom-auth/server";

export default async function Home() {
	const { data } = await getUser();
	if (data?.user) {
		redirect("/auth/sign-in");
	} else {
		redirect("/dashboard");
	}
}
