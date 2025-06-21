"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Info as InfoIcon } from "@phosphor-icons/react/dist/ssr";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

import { paths } from "@/paths";

export function AgentsByUndisbursed({ agents }) {
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<InfoIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Agentes con pendientes"
			/>
			<List
				disablePadding
				sx={{
					p: 1,
					"& .MuiListItemButton-root": { borderRadius: 1 },
					"& .MuiBadge-dot": {
						border: "2px solid var(--mui-palette-background-paper)",
						borderRadius: "50%",
						bottom: "5px",
						height: "12px",
						right: "5px",
						width: "12px",
					},
				}}
			>
				{agents.map((agent) => (
					<ListItem key={agent.id}>
						<ListItemAvatar>
							<Badge color="warning" badgeContent={agent.pendings}>
								<Avatar
									src={agent.avatar}
									sx={{
										bgcolor: "var(--mui-palette-background-paper)",
										boxShadow: "var(--mui-shadows-8)",
										color: "var(--mui-palette-text-primary)",
									}}
								/>
							</Badge>
						</ListItemAvatar>
						<ListItemText
							disableTypography
							primary={
								<Typography noWrap variant="subtitle2">
									{agent.name}
								</Typography>
							}
						/>
					</ListItem>
				))}
			</List>
			<Divider />
			<CardActions>
				<Button color="secondary" endIcon={<ArrowRightIcon />} size="small" href={paths.dashboard.users}>
					Ver todos los agentes
				</Button>
			</CardActions>
		</Card>
	);
}
