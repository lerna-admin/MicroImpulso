import * as React from "react";
import Box from "@mui/material/Box";

import { appConfig } from "@/config/app";
import { getUser } from "@/lib/custom-auth/server";
import { NewClientsByDateRange } from "@/components/dashboard/reports/new-clients-by-date-range/new-clients-by-date-range";

import { getNewClientsByDateRange } from "../services/reports";

export const metadata = { title: `Clientes Nuevos por Rango de Fechas | Dashboard | ${appConfig.name}` };

export default async function Page({ searchParams }) {
	const { startDate, endDate } = await searchParams;

	const {
		data: { user },
	} = await getUser();

	const { records } = await getNewClientsByDateRange({ userId: user.id, startDate, endDate });

	const recordsFormatted = records.map(({ client, loan }) => ({
		id: client.id,
		clientName: client.name,
		createdAt: client.createdAt,
		amount: loan?.amount,
		branch: loan?.agent.branch.name,
	}));

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<NewClientsByDateRange filters={{ startDate, endDate }} rows={recordsFormatted} />
		</Box>
	);
}
