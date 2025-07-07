import * as React from "react";
import { getCashFlowSummary, getCashMovements } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import { Card, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { CashFlowHeader } from "@/components/dashboard/cash-flow/cash-flow-header";
import { MovementsPagination } from "@/components/dashboard/cash-flow/movements-pagination";
import { MovementsTable } from "@/components/dashboard/cash-flow/movements-table";
import { Summary } from "@/components/dashboard/cash-flow/summary";

export const metadata = { title: `Movimientos de caja | Dashboard | ${appConfig.name}` };

dayjs.locale("es");

export default async function Page({ searchParams }) {
	const { page, limit, date, search } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const assets = await getCashFlowSummary(user.branch.id, date);
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
				<CashFlowHeader user={user} />
				<Grid container spacing={4}>
					<Grid size={12} justifyContent={"flex-end"}>
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
						<Summary assets={assets} />
					</Grid>
					<Grid size={12}>
						<Card>
							<MovementsTable movementsData={movementsData} filters={{ page, limit }} />
							<Divider />
							<MovementsPagination
								filters={{ page, limit }}
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
