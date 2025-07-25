import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { TransactionDetails } from "@/components/dashboard/reports/transaction-details/transaction-details";

import { getAllBranches } from "../../configuration/branch-managment/hooks/use-branches";
import { getTransactionDetails } from "../services/reports";

export const metadata = { title: `Detalle de Transacciones  | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate, branch } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const branches = await getAllBranches();
	const branchesFormatted = branches.map(({ id, name }) => ({ id, name }));

	const { transactions } = await getTransactionDetails({
		userId: user.id,
		startDate: startDate === undefined ? dayjs().format("YYYY-MM-DD") : startDate,
		endDate: endDate === undefined ? dayjs().format("YYYY-MM-DD") : endDate,
		branchId: branch,
	});
	
	const transactionsFormatted = transactions.map((tr) => ({
		type: tr.type,
		amount: tr.amount,
		clientName: tr.client?.name,
		agentName: tr.agent?.name,
		branchName: tr.branch?.name,
		date: tr.date,
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
			<TransactionDetails
				data={transactionsFormatted}
				user={user}
				filters={{ startDate, endDate, branch }}
				branches={branchesFormatted}
			/>
		</Box>
	);
}
