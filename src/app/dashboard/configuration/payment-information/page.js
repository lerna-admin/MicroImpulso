import * as React from "react";
import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { PaymentAccountTabs } from "@/components/dashboard/configuration/payment-account-tabs";

import { getAllPaymentsInformation } from "./hooks/use-payments-information";

export const metadata = { title: `Información de pago | Dashboard | ${appConfig.name}` };

export default async function Page() {
	let count = 1;

	const data = await getAllPaymentsInformation(true);
	const tabsInfo = data.map((element) => {
		return {
			id: count++,
			label: element.bankName,
			isPrimary: element.isPrimary,
			paymentAccount: { ...element },
		};
	});

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
						<Typography variant="h4" padding={3}>
							Información de pago
						</Typography>
					</Box>
				</Stack>
			</Stack>
			<Card>
				<PaymentAccountTabs tabsInfo={tabsInfo} />
			</Card>
		</Box>
	);
}
