import * as React from "react";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { CaretDown as CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { ShoppingCartSimple as ShoppingCartSimpleIcon } from "@phosphor-icons/react/dist/ssr/ShoppingCartSimple";
import { Timer as TimerIcon } from "@phosphor-icons/react/dist/ssr/Timer";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";
import { EventsTimeline } from "@/components/dashboard/order/events-timeline";
import { LineItemsTable } from "@/components/dashboard/order/line-items-table";

export const metadata = { title: `Details | Orders | Dashboard | ${appConfig.name}` };

const lineItems = [
	{
		id: "LI-001",
		product: "Fernando Martinez",
		quantity: 1,
		currency: "USD",
		unitAmount: 100000,
		totalAmount: 120000,
	},
	{
		id: "LI-002",
		product: "Natalia Perez",
		quantity: 1,
		currency: "USD",
		unitAmount: 300000,
		totalAmount: 360000,
	},
];

const events = [
	{
		id: "EV-004",
		createdAt: dayjs().subtract(3, "hour").toDate(),
		type: "note_added",
		author: { name: "Fran Perez", avatar: "/assets/avatar-5.png" },
		note: "Customer states that the products have been damaged by the courier.",
	},
	{
		id: "EV-003",
		createdAt: dayjs().subtract(12, "hour").toDate(),
		type: "shipment_notice",
		description: "Left the package in front of the door",
	},
	{
		id: "EV-002",
		createdAt: dayjs().subtract(18, "hour").toDate(),
		type: "items_shipped",
		carrier: "USPS",
		trackingNumber: "940011189",
	},
	{ id: "EV-001", createdAt: dayjs().subtract(21, "hour").toDate(), type: "order_created" },
];

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
			<Stack spacing={4}>
				<div>
					<Link
						color="text.primary"
						component={RouterLink}
						href={paths.dashboard.customers.list}
						sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
						variant="subtitle2"
					>
						<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
						Solicitudes
					</Link>
				</div>
				<div>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
						<Box sx={{ flex: "1 1 auto" }}>
							<Typography variant="h5"></Typography>
						</Box>
						<div>
							
						</div>
					</Stack>
				</div>
				<Grid container spacing={4}>
					<Grid
						size={{
							md: 12,
							xs: 12,
						}}
					>
						<Stack spacing={4} >
							<Card>
								<CardHeader
									
									avatar={
										<Avatar>
											<CreditCardIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Informacion del Cliente"
								/>
								<CardContent>
									<Card sx={{ borderRadius: 1 }} variant="outlined">
										<PropertyList divider={<Divider />} sx={{ "--PropertyItem-padding": "12px 24px" }}  stripe={undefined}>
											{[
												{ key: "Nombre", value: <Link variant="subtitle2">Miron Vitold</Link> },
												{
													key: "Direccion",
													value: (
														<Typography variant="subtitle2">
															1721 Bartlett Avenue
															<br />
															Southfield, Michigan, United States
															<br />
															48034
														</Typography>
													),
												},
												{
													key: "Status",
													value: (
														<Chip
															icon={<CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />}
															label="Completed"
															size="small"
															variant="outlined"
														/>
													),
												}
												
											].map((item) => (
												<PropertyItem key={item.key} name={item.key} value={item.value} />
											))}
										</PropertyList>
									</Card>
								</CardContent>
							</Card>
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<ShoppingCartSimpleIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Solicitudes del Cliente"
								/>
								<CardContent>
									<Stack spacing={2}>
										<Card sx={{ borderRadius: 1 }} variant="outlined">
											<Box sx={{ overflowX: "auto" }}>
												<LineItemsTable rows={lineItems} />
											</Box>
										</Card>
										<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
											<Stack spacing={2} sx={{ width: "300px", maxWidth: "100%" }}>
												
												
											
												<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
													<Typography variant="subtitle1">Total</Typography>
													<Typography variant="subtitle1">
														{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(480000)}
													</Typography>
												</Stack>
											</Stack>
										</Box>
									</Stack>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
					
				</Grid>
			</Stack>
		</Box>
	);
}
