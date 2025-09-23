import * as React from "react";
import { Card, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { Consultations } from "@/components/dashboard/configuration/consultations.js";

export const metadata = { title: `Resumen | Consultas | ${appConfig.name}` };

export default async function Page() {
	const {
		data: { user },
	} = await getUser();

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
				<Stack spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Consultas</Typography>
					</Box>
				</Stack>
				<Stack>
					<Card>
						<Consultations role={user.role} />
					</Card>
				</Stack>
			</Stack>
		</Box>
	);
}
