import * as React from "react";
import { Card, Chip, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { CashFlowHeader } from "@/components/dashboard/cash-flow/cash-flow-header";
import { MovementsPagination } from "@/components/dashboard/cash-flow/movements-pagination";
import { Summary } from "@/components/dashboard/cash-flow/summary";
import { MovementsTable } from "@/components/dashboard/cash-flow/table-movements";

export const metadata = { title: `Movimientos de caja | Dashboard | ${appConfig.name}` };

dayjs.locale("es");

const assets = [
	{ label: "Caja anterior", value: 1000, trend: "increase" },
	{ label: "Entra caja", value: 0, trend: "decrease" },
	{ label: "Cobro", value: 0, trend: "increase" },
	{ label: "Prestamos", value: 0, trend: "decrease" },
	{ label: "Gastos", value: 0, trend: "increase" },
	{ label: "Caja real", value: 0, trend: "decrease" },
];

const invoices = [
	{
		id: "INV-004",
		description: "Anim excepteur dolor excepteur id voluptate amet adipisicing exercitation non eu.",
		amount: 550_000,
		category: "cobro",
		createdDate: dayjs().subtract(1, "hour").toDate(),
	},
	{
		id: "INV-003",
		description: "Sint qui incididunt ea occaecat incididunt ad cillum sunt tempor.",
		amount: 190_000,
		category: "prestamos",
		createdDate: dayjs().subtract(2, "hour").subtract(2, "day").toDate(),
	},
	{
		id: "INV-002",
		description: "Ullamco est ex ullamco magna esse qui consequat laborum minim deserunt ut velit eu.",
		amount: 781_000,
		category: "gastos",
		createdDate: dayjs().subtract(4, "hour").subtract(6, "day").toDate(),
	},
];

export default function Page() {
	const rawDate = dayjs().format("MMMM YYYY");
	const todayMonth = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
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
				<CashFlowHeader />
				<Grid container spacing={4}>
					<Grid size={12} sx={{ display: "flex", justifyContent: "space-between" }}>
						<Typography variant="subtitle1">Dashboard Financial</Typography>
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
							<MovementsPagination count={invoices.length + 10} page={0} />
						</Card>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
