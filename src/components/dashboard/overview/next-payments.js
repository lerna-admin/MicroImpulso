import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CalendarBlank as CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";

import { dayjs } from "@/lib/dayjs";

export function NextPayments({ payments }) {
	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar>
						<CalendarBlankIcon fontSize="var(--Icon-fontSize)" />
					</Avatar>
				}
				subheader=""
				title="Proximos pagos"
			/>
			<CardContent sx={{ py: "8px" }}>
				<List disablePadding>
					{payments.map((payment) => (
						<PaymentItem payment={payment} key={payment.id} />
					))}
				</List>
			</CardContent>
			<Divider />
			<CardActions>
				<Button color="secondary" endIcon={<ArrowRightIcon />} size="small">
					Ver todos los pagos
				</Button>
			</CardActions>
		</Card>
	);
}

function PaymentItem({ payment }) {
	return (
		<ListItem disableGutters key={payment.id}>
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
					<Typography variant="caption">{dayjs(payment.endDateAt).format("MMM").toUpperCase()}</Typography>
					<Typography variant="h6">{dayjs(payment.endDateAt).format("D")}</Typography>
				</Box>
			</ListItemAvatar>
			<ListItemText
				disableTypography
				primary={
					<Typography noWrap variant="subtitle2">
						{payment.name}
					</Typography>
				}
				secondary={
					<Typography color="text.secondary" noWrap variant="body2">
						{payment.typePayment}
					</Typography>
				}
			/>
			<IconButton>
				<CalendarBlankIcon />
			</IconButton>
		</ListItem>
	);
}
