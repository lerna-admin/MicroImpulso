import * as React from "react";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { dayjs } from "@/lib/dayjs";
import { Content } from "@/components/dashboard/cash-flow/content";
import { Summary } from "@/components/dashboard/cash-flow/summary";
import { TableMovements } from "@/components/dashboard/cash-flow/table-movements";

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
				<Content />
				<Grid container spacing={4}>
					<Grid size={12} sx={{ display: "flex", justifyContent: "space-between" }}>
						<Typography variant="subtitle1">Dashboard Financial</Typography>
						<Chip label={todayMonth} size="md" variant="outlined" />
					</Grid>
					<Grid size={12}>
						<Summary assets={assets} />
					</Grid>
					<Grid size={12}>
						<TableMovements />
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
