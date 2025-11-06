import * as React from "react";
import RouterLink from "next/link";
import { Chip, LinearProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";
import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";
import { ExportComponent } from "@/components/dashboard/export/export-component";
import { HistoryPayments } from "@/components/dashboard/transactions/history-payment";

import { getRequestById } from "../hooks/use-requests";
import { getUser } from "@/lib/custom-auth/server";

export const metadata = { title: `Detalle solicitud | Dashboard | ${appConfig.name}` };

function calculatePercentage(totalPagado, totalPrestado) {
	const percentage = (totalPagado / totalPrestado) * 100;
	return percentage.toFixed(2);
}

function calculateAmountPaid(transactions) {
	const amount = transactions
		.filter((transaction) => transaction.Transactiontype === "repayment")
		.reduce((acumulado, transaction) => acumulado + transaction.amount, 0);
	return amount;
}

function calculatePayments(transactions) {
	const payments = transactions.filter((transaction) => transaction.Transactiontype === "repayment");
	return payments.length;
}

export default async function Page({ params }) {
	const { requestId } = params;
	const { client, transactions, requestedAmount, amount, notes, status } = await getRequestById(requestId);

	const {
		data: { user },
	} = await getUser();

	const detailRowsToExport = transactions.map((item) => ({
		Fecha: item.date,
		Monto: item.amount,
		"Tipo de Transaccion": item.reference,
	}));

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
				<Stack spacing={3} direction={"row"} justifyContent={"space-between"}>
					<div>
						<Link
							color="text.primary"
							component={RouterLink}
							href={paths.dashboard.requests.list}
							sx={{ alignItems: "center", display: "inline-flex", gap: 1 }}
							variant="subtitle2"
						>
							<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />
							Solicitudes
						</Link>
					</div>

					<ExportComponent reports={{ reportName: `Historial de transacciones ${client.name}`, detailRowsToExport }} />
				</Stack>
				<Grid container spacing={4}>
					<Grid
						size={{
							lg: 4,
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
									title={
										<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
											<Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
												<Typography variant="body1" color="initial">
													Solicitud
												</Typography>
											</Box>
											{status.toLowerCase() === "rejected" ? (
												<Chip
													icon={<XCircleIcon color="var(--mui-palette-error-main)" weight="fill" />}
													label={"Rechazada"}
													size="small"
													variant="outlined"
												/>
											) : null}
										</Box>
									}
								/>
								<PropertyList
									divider={<Divider />}
									orientation="vertical"
									sx={{ "--PropertyItem-padding": "12px 24px" }}
								>
									{[
										{ key: "ID", value: requestId },
										{ key: "Motivo de rechazo", value: notes },
									].map((item) =>
										item.key === "Motivo de rechazo" && status.toLowerCase() !== "rejected" ? null : (
											<PropertyItem key={item.key} name={item.key} value={item.value} />
										)
									)}
								</PropertyList>
							</Card>
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Cliente"
								/>
								<PropertyList
									divider={<Divider />}
									orientation="vertical"
									sx={{ "--PropertyItem-padding": "12px 24px" }}
								>
									{[
										{ key: "Documento", value: client.document },
										{ key: "Nombre", value: client.name },
										{ key: "Dirección", value: client.address },
										{ key: "Correo", value: client.email },
										{ key: "Celular", value: client.phone },
										{
											key: "Total pagado",
											value: (
												<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
													<LinearProgress
														sx={{ flex: "1 1 auto" }}
														value={calculatePercentage(calculateAmountPaid(transactions), amount)}
														variant="determinate"
													/>
													<Typography color="text.secondary" variant="body2">
														{`${calculatePercentage(calculateAmountPaid(transactions), amount)}%`}
													</Typography>
												</Stack>
											),
										},
									].map((item) => (
										<PropertyItem key={item.key} name={item.key} value={item.value} />
									))}
								</PropertyList>
							</Card>
						</Stack>
					</Grid>
					<Grid
						size={{
							lg: 8,
							xs: 12,
						}}
					>
						<Stack spacing={4}>
							<HistoryPayments
								userId={user.id}
								requestedAmount={requestedAmount}
								amountPaid={calculateAmountPaid(transactions)}
								amountToPay={amount}
								totalTransactions={calculatePayments(transactions)}
								payments={transactions}
								requestId={requestId}
							/>
						</Stack>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	);
}
