import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { AverageApprovalTime } from "@/components/dashboard/reports/average-approval-time/average-approval-time";

import { getAverageApprovalTime } from "../services/reports";

export const metadata = { title: `Tiempo Promedio de Aprobación | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

	const { averageDisbursementTime, details } = await getAverageApprovalTime({ userId: user.id });

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<AverageApprovalTime data={{ averageDisbursementTime, details }} user={user} />
		</Box>
	);
}
