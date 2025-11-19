"use client";

import * as React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TrendDown as TrendDownIcon, TrendUp as TrendUpIcon } from "@phosphor-icons/react/dist/ssr";

export function CashFlowSummary({ assets }) {
	const theme = useTheme();
	console.log("[CashFlow] CashFlowSummary render", { assets });

	// Detecta breakpoint activo
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));

	// Determina columnas activas
	const columns = isLg ? 4 : isMd ? 2 : 1;

	return (
		<Card>
			<Box
				sx={{
					display: "grid",
					columnGap: 0,
					rowGap: 3,
					gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
					p: 3,
				}}
			>
				{assets.map((asset, index) => {
					console.log("[CashFlow] CashFlowSummary tile", { index, ...asset });
					const isLastInRow = (index + 1) % columns === 0;

					return (
						<React.Fragment key={asset.label}>
							<Stack
								spacing={1}
								padding={2}
								sx={{
									borderRight: isLastInRow ? "none" : "1px solid var(--mui-palette-divider)",
									borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
								}}
							>
								<Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
									<Typography color="text.secondary" variant="body2">
										{asset.label}
									</Typography>
									{asset.trend === "increase" ? (
										<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
									) : asset.trend === "decrease" ? (
										<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
									) : null}
								</Stack>
								<Typography
									variant="h4"
									color={
										asset.trend === "increase"
											? "var(--mui-palette-success-main)"
											: asset.trend === "decrease"
												? "var(--mui-palette-error-main)"
												: "inherit"
									}
								>
									{new Intl.NumberFormat("es-CO", {
										style: "currency",
										currency: "COP",
										minimumFractionDigits: 0,
									}).format(asset.value)}
									{asset.label === "Renovados" || asset.label === "Préstamos" || asset.label === "Nuevos" ? ` (${asset.amount})` : null}
								</Typography>
							</Stack>
						</React.Fragment>
					);
				})}
			</Box>
		</Card>
	);
}
