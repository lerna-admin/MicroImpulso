import * as React from "react";
import RouterLink from "next/link";
import { CardContent } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { PropertyList } from "@/components/core/property-list";
import { CustomerEditForm } from "@/components/dashboard/customer/customer-edit-form";
import { CustomersLineItemsTable } from "@/components/dashboard/customer/customers-line-items-table";

import { getAllRequestsByCustomerId } from "../../requests/hooks/use-requests";
import { getCustomerById } from "../hooks/use-customers";

export const metadata = { title: `Detalle | Clientes | Dashboard | ${appConfig.name}` };

export default async function Page({ params }) {
	const { customerId } = params;
	const customer = await getCustomerById(customerId);
	const allRequestByClient = await getAllRequestsByCustomerId(customerId);

	// const totalRequestsAmountToPay = allRequestByClient.reduce((acc, req) => acc + req.amount, 0);

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
				<Stack spacing={3}>
					<div>
						<Link
							color="text.primary"
							component={RouterLink}
							href={paths.dashboard.customers.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Clientes
						</Link>
					</div>
				</Stack>
				<Grid container spacing={4}>
					<Grid
						size={{
							lg: 12,
							xs: 12,
						}}
					>
						<Stack spacing={4}>
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Perfil"
								/>
								<PropertyList
									divider={<Divider />}
									orientation="vertical"
									sx={{ "--PropertyItem-padding": "12px 24px" }}
								>
									<CustomerEditForm customerToEdit={customer}></CustomerEditForm>
								</PropertyList>
							</Card>
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Solicitudes del Cliente"
								/>
								<CardContent>
									<Card sx={{ borderRadius: 1 }} variant="outlined">
										<Box sx={{ overflowX: "auto" }}>
											<CustomersLineItemsTable rows={allRequestByClient} />
										</Box>
										{/* <Divider />
										<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
											<Stack spacing={2} sx={{ width: "300px", maxWidth: "100%" }}>
												<Stack direction="row" sx={{ justifyContent: "space-between" }}>
													<Typography variant="subtitle1">Total</Typography>
													<Typography variant="subtitle1">
														{new Intl.NumberFormat("es-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(totalRequestsAmountToPay)}
													</Typography>
												</Stack>
											</Stack>
										</Box> */}
									</Card>
								</CardContent>
							</Card>
						</Stack>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
