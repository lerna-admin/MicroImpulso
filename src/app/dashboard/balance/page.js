import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { DetailBalanceList } from "@/components/widgets/detail-lists/detail-balance-list";

export const metadata = { title: `Balance de la ruta | Dashboard | ${appConfig.name}` };

export default function Page() {
	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<DetailBalanceList />
		</Box>
	);
}
