import * as React from "react";
import { getCashFlowSummary, getCashMovements } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import { Button, Card, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { CashFlowHeader } from "@/components/dashboard/cash-flow/cash-flow-header";
import { CashFlowSummary } from "@/components/dashboard/cash-flow/cash-flow-summary";
import { MovementsPagination } from "@/components/dashboard/cash-flow/movements-pagination";
import { MovementsTable } from "@/components/dashboard/cash-flow/movements-table";

export const metadata = { title: `Movimientos de caja | Dashboard | ${appConfig.name}` };

dayjs.locale("es");

export default async function Page({ searchParams }) {
	const { page, limit, date, search } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const assets = await getCashFlowSummary(user.id, date);

	const {
		data: movementsData,
		total: movementsTotalItems,
		page: movementsPage,
		limit: movementLimit,
	} = await getCashMovements(user.branch.id, search, page, limit, date);

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={10}>
				<CashFlowHeader user={user} filters={{date}} />
				<Grid container spacing={4}>
					<Grid size={12} display={"flex"} justifyContent={"space-between"}>
						<Chip
							label={
								date === undefined
									? dayjs().format("D MMMM YYYY").toUpperCase()
									: dayjs(date).format("D MMMM YYYY").toUpperCase()
							}
							size="md"
							variant="outlined"
						/>
					</Grid>
					<Grid size={12}>
						<CashFlowSummary assets={assets} />
					</Grid>
					<Grid size={12}>
						<Card>
							<MovementsTable movementsData={movementsData} filters={{ page, limit, date, search }} />
							<Divider />
							<MovementsPagination
								filters={{ page, limit, date, search }}
								movementsTotalItems={movementsTotalItems}
								movementsPage={movementsPage - 1}
								movementLimit={movementLimit}
							/>
						</Card>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
