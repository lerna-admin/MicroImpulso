import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { UpcomingDueDates } from "@/components/dashboard/reports/upcoming-due-dates/upcoming-due-dates";

import { getUpcomingDues } from "../services/reports";

export const metadata = { title: `Vencimientos Próximos | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

	const { loans } = await getUpcomingDues({ userId: user.id });

	const loansFormatted = loans.map((loan) => ({
		id: loan.loanId,
		clientName: loan.clientName,
		amount: loan.loanAmount,
		createdAt: loan.dueDate,
	}));

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<UpcomingDueDates data={loansFormatted} />
		</Box>
	);
}
