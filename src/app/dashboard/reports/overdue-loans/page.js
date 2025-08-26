import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { OverdueLoans } from "@/components/dashboard/reports/overdue-loans/overdue-loans";

import { getOverdueLoans } from "../services/reports";

export const metadata = { title: `Préstamos Vencidos | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

	const { loans, totals } = await getOverdueLoans({ userId: user.id });

	const loansFormatted = loans.map(({ loanId, clientName, loanAmount, totalRepaid, dueDate, agentName }) => {
		return {
			id: loanId,
			clientName,
			pendingAmount: loanAmount - totalRepaid,
			daysMora: dayjs().diff(dueDate, "day"),
			agentName,
			dueDate,
		};
	});

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<OverdueLoans rows={loansFormatted} totals={totals} />
		</Box>
	);
}
