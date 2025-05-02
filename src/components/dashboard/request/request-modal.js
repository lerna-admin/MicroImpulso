"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";

import { LineItemsTable } from "./line-items-table";

const lineItems = [
	{
		id: "001",
		creditDate: "2025-02-07T14:37:00",
		expirationDate: "2025-02-20",
		paymentDate: "2025-02-19T13:15:00",
		currency: "USD",
		payment: 24,
	},
	{
		id: "002",
		creditDate: "2025-02-07T14:37:00",
		expirationDate: "2025-02-20",
		paymentDate: "2025-02-24T16:15:00",
		currency: "USD",
		payment: 35,
	},
];

export function RequestModal({ open }) {
	const router = useRouter();

	// This component should load the order from the API based on the orderId prop.
	// For the sake of simplicity, we are just using a static order object.

	const handleClose = React.useCallback(() => {
		router.push(paths.dashboard.requests.list);
	}, [router]);

	return (
		<Dialog
			maxWidth={"none"}
			onClose={handleClose}
			open={open}
			slotProps={{
				paper: {
					sx: {
						width: "200px",
					},
				},
			}}
		>
			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 0 }}>
				<Stack direction="row" sx={{ alignItems: "center", flex: "0 0 auto", justifyContent: "space-between" }}>
					<Typography variant="h6">{"000-001"}</Typography>
					<IconButton onClick={handleClose}>
						<XIcon />
					</IconButton>
				</Stack>
				<Stack spacing={3} sx={{ flex: "1 1 auto", overflowY: "auto" }}>
					<Stack spacing={3}>
						<Stack direction="row" spacing={3} sx={{ alignItems: "center", justifyContent: "space-between" }}>
							<Typography variant="h6">Historico credito</Typography>
							<Button
								color="secondary"
								component={RouterLink}
								href={paths.dashboard.requests.details("1")}
								startIcon={<PlusIcon />}
							>
								Añadir
							</Button>
						</Stack>
						{/* <Card sx={{ borderRadius: 1 }} variant="outlined">
							<PropertyList divider={<Divider />} sx={{ "--PropertyItem-padding": "12px 24px" }}>
								{[
									{ key: "Customer", value: <Link variant="subtitle2">Miron Vitold</Link> },
									{
										key: "Address",
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
									{ key: "Date", value: dayjs().subtract(3, "hour").format("MMMM D, YYYY hh:mm A") },
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
									},
									{
										key: "Payment method",
										value: (
											<Stack direction="row" spacing={2}>
												<Avatar
													sx={{ bgcolor: "var(--mui-palette-background-paper)", boxShadow: "var(--mui-shadows-8)" }}
												>
													<Box
														component="img"
														src="/assets/payment-method-1.png"
														sx={{ borderRadius: "50px", height: "auto", width: "35px" }}
													/>
												</Avatar>
												<div>
													<Typography variant="body2">Mastercard</Typography>
													<Typography color="text.secondary" variant="body2">
														**** 4242
													</Typography>
												</div>
											</Stack>
										),
									},
								].map((item) => (
									<PropertyItem key={item.key} name={item.key} value={item.value} />
								))}
							</PropertyList>
						</Card> */}
					</Stack>
					<Stack spacing={3}>
						{/* <Typography variant="h6">Line items</Typography> */}
						<Card sx={{ borderRadius: 1 }} variant="outlined">
							<Box sx={{ overflowX: "auto" }}>
								<LineItemsTable rows={lineItems} />
							</Box>
							<Divider />
							<Box sx={{ display: "flex", justifyContent: "flex-end", p: 3 }}>
								<Stack spacing={2} sx={{ width: "300px", maxWidth: "100%" }}>
									<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
										<Typography variant="body2">Saldo:</Typography>
										<Typography variant="body2">
											{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(59)}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
										<Typography variant="body2">Cupo aprobado:</Typography>
										<Typography variant="body2">
											{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(100)}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
										<Typography variant="body2">Total a pagar:</Typography>
										<Typography variant="body2">
											{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(120)}
										</Typography>
									</Stack>
									<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
										<Typography variant="body2">Cuotas pagas:</Typography>
										<Typography variant="body2">2 de 3</Typography>
									</Stack>
									<Stack direction="row" spacing={3} sx={{ justifyContent: "space-between" }}>
										<Typography variant="body2">Mora:</Typography>
										<Typography variant="body2">4</Typography>
									</Stack>
								</Stack>
							</Box>
						</Card>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}
