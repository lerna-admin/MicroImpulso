import * as React from "react";
import { getCashFlowSummary, getCashMovements } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import { Card, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { dayjs } from "@/lib/dayjs";
import { CashFlowHeader } from "@/components/dashboard/cash-flow/cash-flow-header";
import { MovementsPagination } from "@/components/dashboard/cash-flow/movements-pagination";
import { Summary } from "@/components/dashboard/cash-flow/summary";
import { MovementsTable } from "@/components/dashboard/cash-flow/table-movements";

export const metadata = { title: `Movimientos de caja | Dashboard | ${appConfig.name}` };

dayjs.locale("es");

export default async function Page() {
	const rawDate = dayjs().format("MMMM YYYY");
	const todayMonth = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

	const {
		data: { user },
	} = await getUser();

	const { data: invoices } = await getCashMovements(user.branch.id);
	const assets = await getCashFlowSummary(user.branch.id);

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
				<CashFlowHeader branch={user.branch.name} />
				<Grid container spacing={4}>
					<Grid size={12} sx={{ display: "flex", justifyContent: "end" }}>
						<Chip label={todayMonth} size="md" variant="outlined" />
					</Grid>
					<Grid size={12}>
						<Summary assets={assets} />
					</Grid>
					<Grid size={12}>
						<Card>
							<Box sx={{ overflowX: "auto" }}>
								<MovementsTable invoices={invoices} />
							</Box>
							<Divider />
							{/* TODO arreglar la paginacion para que quede funcional */}
							<MovementsPagination count={invoices.length + 10} page={0} />
						</Card>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
