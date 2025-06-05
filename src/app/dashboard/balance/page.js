import * as React from "react";
import { getClosingSummaryByAgent } from "@/app/dashboard/requests/hooks/use-requests";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { DetailBalanceList } from "@/components/widgets/detail-lists/detail-balance-list";

export const metadata = { title: `Balance de la ruta | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

	const data = await getClosingSummaryByAgent(user.id);
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DetailBalanceList data={data} />
		</Box>
	);
}
