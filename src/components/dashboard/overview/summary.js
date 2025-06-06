import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TrendDown as TrendDownIcon } from "@phosphor-icons/react/dist/ssr/TrendDown";
import { TrendUp as TrendUpIcon } from "@phosphor-icons/react/dist/ssr/TrendUp";

export function Summary({ amount, diff, icon: Icon, title, trend, requireTrend = true }) {
	return (
		<Card>
			<CardContent>
				<Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
					<Avatar
						sx={{
							"--Avatar-size": "48px",
							bgcolor: "var(--mui-palette-background-paper)",
							boxShadow: "var(--mui-shadows-8)",
							color: "var(--mui-palette-text-primary)",
						}}
					>
						<Icon fontSize="var(--icon-fontSize-lg)" />
					</Avatar>
					<div>
						<Typography color="text.secondary" variant="body1">
							{title}
						</Typography>
						<Typography variant="h3">{new Intl.NumberFormat("en-US").format(amount)}</Typography>
					</div>
				</Stack>
			</CardContent>

			{requireTrend ? (
				<>
					<Divider />
					<Box sx={{ p: "16px" }}>
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<Box
								sx={{
									alignItems: "center",
									color: trend === "increase" ? "var(--mui-palette-success-main)" : "var(--mui-palette-error-main)",
									display: "flex",
									justifyContent: "center",
								}}
							>
								{trend === "increase" ? (
									<TrendUpIcon fontSize="var(--icon-fontSize-md)" />
								) : (
									<TrendDownIcon fontSize="var(--icon-fontSize-md)" />
								)}
							</Box>
							<Typography color="text.secondary" variant="body2">
								<Typography color={trend === "increase" ? "success.main" : "error.main"} component="span" variant="subtitle2">
									{new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 }).format(diff / 100)}
								</Typography>{" "}
								{trend === "increase" ? "de incremento" : "de decremento"} respecto al último mes.
							</Typography>
						</Stack>
					</Box>
				</>
			) : null}
		</Card>
	);
}
