import * as React from "react";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";

export const metadata = { title: `Plantillas | Dashboard | ${appConfig.name}` };
import { TemplateForm } from "@/components/dashboard/configuration/template-form";

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
			<Stack spacing={4}>
				<Stack spacing={3} sx={{ alignItems: "flex-start" }}>
					<Box sx={{ flex: "1 1 auto" }}>
						<Typography variant="h4">Plantillas</Typography>
					</Box>
				</Stack>
				<Stack>
					<Card>
						<TemplateForm/>
					</Card>
				</Stack>
			</Stack>
		</Box>
	);
}
