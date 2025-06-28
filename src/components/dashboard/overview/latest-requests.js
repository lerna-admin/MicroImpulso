import * as React from "react";
import { formatCurrency } from "@/helpers/format-currency";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { CardsThree as CardsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

import { paths } from "@/paths";

export function LatestRequests({ subscriptions }) {
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<CardsThreeIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				title="Ultimas solicitudes"
			/>
			<CardContent sx={{ pb: "8px" }}>
				<List disablePadding>
					{subscriptions.map((subscription) => (
						<LatestItem key={subscription.id} subscription={subscription} />
					))}
				</List>
			</CardContent>
			<Divider />
			<CardActions>
				<Button color="secondary" endIcon={<ArrowRightIcon />} size="small" href={paths.dashboard.requests.list}>
					Ver todas las solicitudes
				</Button>
			</CardActions>
		</Card>
	);
}

function LatestItem({ subscription }) {
	const { label, color } = {
		new: { label: "Nueva", color: "info" },
		under_review: { label: "En estudio", color: "warning" },
		approved: { label: "Aprobada", color: "info" },
		rejected: { label: "Rechazada", color: "error" },
		canceled: { label: "Cancelada", color: "error" },
		completed: { label: "Completada", color: "success" },
		funded: { label: "Desembolsada", color: "warning" },
	}[subscription.status];

	return (
		<ListItem disableGutters>
			<ListItemText
				disableTypography
				primary={
					<Typography noWrap variant="subtitle2">
						{subscription.name}
					</Typography>
				}
				secondary={
					<Typography sx={{ whiteSpace: "nowrap" }} variant="body2">
						{formatCurrency(subscription.amount)}
					</Typography>
				}
			/>
			<Chip color={color} label={label} size="small" variant="soft" />
		</ListItem>
	);
}
