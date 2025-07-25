"use client";

import * as React from "react";
import {
	Avatar,
	Card,
	CardHeader,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import { TrendDown as TrendDownIcon } from "@phosphor-icons/react/dist/ssr/TrendDown";
import { TrendUp as TrendUpIcon } from "@phosphor-icons/react/dist/ssr/TrendUp";

export function AverageApprovalTime({ data }) {
	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Tiempo Promedio de Aprobación
				</Typography>
			</Stack>
			<Card>
				<CardHeader title={`Promedio de ${Number(data.averageDisbursementTime)} dias en todas las sedes`} />
				<List disablePadding sx={{ "& .MuiListItem-root": { py: 2 } }}>
					{data.details.map((detail) => (
						<ListItem divider key={detail.agentId}>
							<ListItemAvatar>
								<Avatar
									sx={{
										bgcolor: detail.averageTime <= 3 ? "var(--mui-palette-success-50)" : "var(--mui-palette-error-50)",
										color:
											detail.averageTime <= 3 ? "var(--mui-palette-success-main)" : "var(--mui-palette-error-main)",
									}}
								>
									{detail.averageTime <= 3 ? (
										<TrendUpIcon fontSize="var(--Icon-fontSize)" />
									) : (
										<TrendDownIcon fontSize="var(--Icon-fontSize)" />
									)}
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								disableTypography
								primary={<Typography variant="subtitle2">{detail.agentName}</Typography>}
								secondary={
									<Typography color="text.secondary" variant="body2">
										{detail.branchName}
									</Typography>
								}
							/>
							<div>
								<Typography
									color={detail.averageTime <= 3 ? "var(--mui-palette-success-main)" : "var(--mui-palette-error-main)"}
									sx={{ textAlign: "right", whiteSpace: "nowrap" }}
									variant="subtitle2"
								>
									{`${detail.averageTime} dias`}
								</Typography>
							</div>
						</ListItem>
					))}
				</List>
			</Card>
		</Stack>
	);
}
