import * as React from "react";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { BranchesTable } from "@/components/dashboard/configuration/branches-table";

import { getAllBranches } from "./hooks/use-branches";

export const metadata = { title: `Gestión de sedes | Dashboard | ${appConfig.name}` };

export default async function Page() {
	const data = await getAllBranches();
	console.log(data);
	

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Gestión de sedes</Typography>
					</Box>
				</Stack>
				<Card>
					<BranchesTable rows={data}/>
				</Card>
			</Stack>
		</Box>
	);
}
