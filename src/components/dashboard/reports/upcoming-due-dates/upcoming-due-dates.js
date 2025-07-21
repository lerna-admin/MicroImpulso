"use client";

import * as React from "react";
import RouterLink from "next/link";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CalendarBlank as CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";

export function UpcomingDueDates({ data = [] }) {
	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Vencimientos Próximos</Typography>
				</Box>
			</Stack>

			<Card>
				<CardContent sx={{ py: "8px" }}>
					<List disablePadding>
						{data.length === 0 ? (
							<Typography color="text.secondary" sx={{ textAlign: "center", p: 3 }} variant="body2">
								No se encontraron solicitudes proximas a vencer.
							</Typography>
						) : (
							data.map((event) => <EventItem event={event} key={event.id} />)
						)}
					</List>
				</CardContent>
				<Divider />
				<CardActions>
					<Button color="secondary" endIcon={<ArrowRightIcon />} size="small" href={paths.dashboard.requests.list}>
						Ver todos las solicitudes
					</Button>
				</CardActions>
			</Card>
		</Stack>
	);
}

function EventItem({ event }) {
	return (
		<ListItem disableGutters key={event.id}>
			<ListItemAvatar>
				<Box
					sx={{
						bgcolor: "var(--mui-palette-background-level1)",
						borderRadius: 1.5,
						flex: "0 0 auto",
						p: "4px 8px",
						textAlign: "center",
					}}
				>
					<Typography variant="caption">{dayjs(event.createdAt).format("MMM").toUpperCase()}</Typography>
					<Typography variant="h6">{dayjs(event.createdAt).format("D")}</Typography>
				</Box>
			</ListItemAvatar>
			<ListItemText
				disableTypography
				primary={
					<Typography noWrap variant="subtitle2">
						{event.clientName}
					</Typography>
				}
				secondary={
					<Typography color="text.secondary" noWrap variant="body2">
						{new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
							event.amount
						)}
					</Typography>
				}
			/>
			<Tooltip title="Ver solicitud">
				<IconButton component={RouterLink} href={paths.dashboard.requests.details(event.id)}>
					<CalendarBlankIcon />
				</IconButton>
			</Tooltip>
		</ListItem>
	);
}
