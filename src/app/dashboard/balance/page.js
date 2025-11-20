import * as React from "react";
import { getDailyTrace } from "@/app/dashboard/balance/hooks/use-balance";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { DetailBalanceList } from "@/components/dashboard/balance/detail-balance-list";
import { dayjs } from "@/lib/dayjs";

export const metadata = { title: `Balance de la ruta | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { date } = await searchParams;

	const today = dayjs().format("YYYY-MM-DD");;

	const {
		data: { user },
	} = await getUser();

	const data = await getDailyTrace(user.id, (date ?? today));

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DetailBalanceList dataBalance={data?.kpis} traceData={data} user={user} filters={{ date }} />
		</Box>
	);
}
