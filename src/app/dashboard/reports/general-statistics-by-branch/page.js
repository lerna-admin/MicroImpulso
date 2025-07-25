import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { GeneralStatisticsByBranch } from "@/components/dashboard/reports/general-statistics-by-branch/general-statistics-by-branch";

export const metadata = { title: `Estadísticas Generales por Sede | Dashboard | ${appConfig.name}` };

export default async function Page() {
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<GeneralStatisticsByBranch />
		</Box>
	);
}
