import * as React from "react";
import RouterLink from "next/link";
import { CardContent, Typography } from "@mui/material";
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
import CustomerDocumentsCard from "@/components/dashboard/customer/customer-documents-card";

export const metadata = { title: `Detalle | Clientes | Dashboard | ${appConfig.name}` };

export default async function Page({ params }) {
	const { customerId } = params;
	const customer = await getCustomerById(customerId);
	const allRequestByClient = await getAllRequestsByCustomerId(customerId);
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
							{/* PERFIL / EDICIÓN */}
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

							{/* CONTACTO ADICIONAL */}
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Contacto adicional"
								/>
								<CardContent>
									<Stack spacing={2}>
										<Box>
											<Typography variant="overline" color="text.secondary" display="block">
												Celular 2
											</Typography>
											<Typography variant="body1">
												{customer?.client.phone2 ? customer.client.phone2 : "—"}
											</Typography>
										</Box>

										<Box>
											<Typography variant="overline" color="text.secondary" display="block">
												Dirección 2
											</Typography>
											<Typography variant="body1">
												{customer?.client.address2 ? customer.client.address2 : "—"}
											</Typography>
										</Box>
									</Stack>
								</CardContent>
							</Card>

							{/* REFERENCIA PERSONAL */}
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Referencia personal"
								/>
								<CardContent>
									<Stack spacing={2}>
										<Box>
											<Typography variant="overline" color="text.secondary" display="block">
												Nombre de la referencia
											</Typography>
											<Typography variant="body1">
												{customer?.client.referenceName ? customer.client.referenceName : "—"}
											</Typography>
										</Box>

										<Box>
											<Typography variant="overline" color="text.secondary" display="block">
												Teléfono de la referencia
											</Typography>
											<Typography variant="body1">
												{customer?.client.referencePhone ? customer.client.referencePhone : "—"}
											</Typography>
										</Box>

										<Box>
											<Typography variant="overline" color="text.secondary" display="block">
												Parentesco / Relación
											</Typography>
											<Typography variant="body1">
												{customer?.client.referenceRelationship ? customer.client.referenceRelationship : "—"}
											</Typography>
										</Box>
									</Stack>
                                </CardContent>
							</Card>

							{/* DOCUMENTOS */}
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Documentos del cliente"
								/>
								<CardContent>
									<CustomerDocumentsCard customerId={customerId} />
								</CardContent>
							</Card>

							{/* SOLICITUDES */}
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
