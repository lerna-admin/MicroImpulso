"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/app/dashboard/transactions/hooks/use-transactions";
import { formatCurrency, unformatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	OutlinedInput,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { ShoppingCartSimple as ShoppingCartSimpleIcon } from "@phosphor-icons/react/dist/ssr/ShoppingCartSimple";
import Cookies from "js-cookie";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";
import { renewRequest } from "@/app/dashboard/requests/hooks/use-requests";

const columns = [
	{
		formatter: (row) => (
			<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
				{dayjs(row.date).utc().format("DD-MM-YYYY")}
			</Typography>
		),
		name: "Fecha",
		align: "start",
		width: "100px",
	},
	{
		formatter: (row) => (
			<Typography sx={{ whiteSpace: "nowrap" }} variant="subtitle2">
				{new Intl.NumberFormat("en-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.amount
				)}
			</Typography>
		),
		name: "Monto",
		width: "150px",
	},
	{
		formatter: (row) => {
			const mapping = {
				disbursement: { label: "Desembolso", color: "warning" },
				repayment: { label: "Pago", color: "success" },
				penalty: { label: "Renovación", color: "error" },
			};
			const { label, color } = mapping[row.Transactiontype] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Tipo de transacción",
		width: "190px",
	},
];

function createSchema(amountToPay, amountPaid) {
	return zod
		.object({
			amount: zod
				.number()
				.min(1, { message: "El monto es requerido" })
				.refine((val) => /^\d+$/.test(val), { message: "Solo se permiten números" })
				.transform(Number)
				.refine((val) => val > 0, { message: "El monto debe ser mayor a 0" }),
		})
		.superRefine((data, ctx) => {
			const restante = amountToPay - amountPaid;
			if (data.amount > restante) {
				ctx.addIssue({
					path: ["amount"],
					message: `El monto excede el saldo restante de $${restante.toLocaleString("es-CL")}`,
					code: zod.ZodIssueCode.custom,
				});
			}
		});
}

export function HistoryPayments({
	amountPaid,
	payments = [],
	requestedAmount,
	totalTransactions,
	amountToPay,
	requestId,
}) {
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");
	const popover = usePopover();
	const popoverAlert = usePopover();
	const schema = createSchema(amountToPay, amountPaid);
	const router = useRouter();
	const isAgentClosed = Cookies.get("isAgentClosed");

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	const dividerOrientation = isSmallScreen ? "horizontal" : "vertical";

	const items = [
		{
			label: "Abonos",
			value: totalTransactions.toString(),
		},
		{
			label: "Total Pagado",
			value: amountPaid,
		},
		{
			label: "Saldo",
			value: amountToPay - amountPaid,
		},
		{
			label: "Total a pagar",
			value: amountToPay,
		},
		{
			label: "Total Prestado",
			value: requestedAmount,
		},
	];

	const today = dayjs();

	const todayPlus = today.add(30, "day");

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
		watch
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			amount: 0,
		},
	});

	const montoARenovar = watch("amount");

	const onSubmit = React.useCallback(async ({ amount }) => {
		try {
			const data = {
				loanRequestId: requestId,
				transactionType: "repayment",
				amount: Number.parseInt(amount),
				reference: "Abono cliente",
			};

			await createTransaction(data);
			reset({ amount: 0 });

			setAlertMsg("¡Pago registrado!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popover.handleClose();
		popoverAlert.handleOpen();
		router.refresh();
	});

	const renovarAuto = async () => {
		try {
			const data = {
				loanRequestId: requestId,
				transactionType: "repayment",
				amount: Number.parseInt(montoARenovar),
				reference: "Abono cliente",
			};

			await createTransaction(data);
			reset({ amount: 0 });

			setAlertMsg("¡Pago registrado!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			await renewRequest({amount: requestedAmount, newDate: todayPlus }, requestId)
		}

		popover.handleClose();
		popoverAlert.handleOpen();
		router.refresh();
	}

	const handleRegisterPay = () => {
		if (isAgentClosed === "true") {
			popoverAlert.handleOpen();
			setAlertMsg("El agente ya hizo el cierre del dia.");
			setAlertSeverity("error");
		} else popover.handleOpen();
	};

	return (
		<React.Fragment>
			{payments.length > 0 ? (
				<Card>
					<CardHeader
						subheader={
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								justifyContent="space-between"
								alignItems={{ xs: "flex-start", sm: "center" }}
							>
								<Stack direction="row" spacing={2} alignItems="center">
									<Avatar sx={{ backgroundColor: "white", color: "black", boxShadow: "var(--mui-shadows-8)" }}>
										<ShoppingCartSimpleIcon fontSize="var(--Icon-fontSize)" />
									</Avatar>
									<Typography color="textPrimary" variant="h6">
										Historial de transacciones
									</Typography>
								</Stack>

								<Button
									color="secondary"
									onClick={handleRegisterPay}
									startIcon={<PlusIcon />}
									sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
								>
									Registrar Pago
								</Button>
							</Stack>
						}
					/>
					<CardContent>
						<Stack spacing={3}>
							<Card sx={{ borderRadius: 1 }} variant="outlined">
								<Stack
									flexWrap={"wrap"}
									direction={{ xs: "column", sm: "row" }}
									spacing={{ xs: 1, sm: 1, md: 1 }}
									divider={<Divider flexItem orientation={dividerOrientation} />}
									sx={{ justifyContent: "space-between", p: 2 }}
								>
									{items.map((item, index) => (
										<Box key={index}>
											<Typography color="text.secondary" variant="overline">
												{item.label}
											</Typography>
											<Typography variant="h6">
												{typeof item.value === "number"
													? new Intl.NumberFormat("en-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(item.value)
													: item.value}
											</Typography>
										</Box>
									))}
								</Stack>
							</Card>
							<Card sx={{ borderRadius: 1 }} variant="outlined">
								<Box sx={{ overflowX: "auto" }}>
									<DataTable columns={columns} rows={payments} />
								</Box>
							</Card>
						</Stack>
					</CardContent>
				</Card>
			) : (
				<Typography variant="h5" color="body2" textAlign={"center"}>
					No hay transacciones
				</Typography>
			)}

			{/* Modal para registrar pago */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={popover.open}
				onClose={popover.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Crear pago"}</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent>
						<Grid container>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="amount"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.amount)}>
											<InputLabel>Monto a pagar</InputLabel>
											<OutlinedInput
												{...field}
												type="text"
												value={formatCurrency(field.value ?? 0)}
												onChange={(e) => {
													const raw = unformatCurrency(e.target.value);
													field.onChange(raw);
												}}
											/>
											{errors.amount ? <FormHelperText>{errors.amount.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions sx={{ padding: 3 }}>
						<Button variant="contained" onClick={handleSubmit(renovarAuto)} autoFocus>
							Renovar inmediatamente
						</Button>
						<Button variant="contained" type="submit" autoFocus>
							Pagar
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								popover.handleClose();
								reset({
									amount: 0,
								});
							}}
						>
							Cancelar
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</React.Fragment>
	);
}
