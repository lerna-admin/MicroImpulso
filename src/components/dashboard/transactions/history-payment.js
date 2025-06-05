"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/app/dashboard/transactions/hooks/use-transactions";
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
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

const columns = [
	{
		formatter: (row) => (
			<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
				{dayjs(row.date).format("MMM D, YYYY hh:mm A")}
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
			};
			const { label, color } = mapping[row.Transactiontype] ?? { label: "Unknown", color: "secondary" };

			return <Chip color={color} label={label} size="small" variant="soft" />;
		},
		name: "Tipo de transacción",
		width: "150px",
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

function formatCurrency(value) {
	const number = typeof value === "string" ? value.replaceAll(/\D/g, "") : value;
	const numberValue = Number.parseInt(number || "0", 10);

	return numberValue.toLocaleString("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
	});
}

function unformatCurrency(formatted) {
	return Number.parseInt(formatted.replaceAll(/\D/g, ""), 10) || 0;
}

export function HistoryPayments({
	amountPaid,
	payments = [],
	requestedAmount,
	totalTransactions,
	amountToPay,
	requestId,
}) {
	const popover = usePopover();
	const schema = createSchema(amountToPay, amountPaid);
	const router = useRouter();

	const {
		reset,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			amount: 0,
		},
	});

	const onSubmit = React.useCallback(async ({ amount }) => {
		const data = {
			loanRequestId: requestId,
			transactionType: "repayment",
			amount: Number.parseInt(amount),
			reference: "Abono cliente",
		};

		await createTransaction(data);

		reset({
			amount: 0,
		});

		router.refresh();
		popover.handleClose();
	});

	return (
		<React.Fragment>
			{payments.length > 0 ? (
				<Card>
					<CardHeader
						action={
							<Button color="secondary" onClick={popover.handleOpen} startIcon={<PlusIcon />}>
								Registrar Pago
							</Button>
						}
						avatar={
							<Avatar>
								<ShoppingCartSimpleIcon fontSize="var(--Icon-fontSize)" />
							</Avatar>
						}
						title="Historial de transacciones"
					/>
					<CardContent>
						<Stack spacing={3}>
							<Card sx={{ borderRadius: 1 }} variant="outlined">
								<Stack
									direction="row"
									divider={<Divider flexItem orientation="vertical" />}
									spacing={3}
									sx={{ justifyContent: "space-between", p: 2 }}
								>
									<div>
										<Typography color="text.secondary" variant="overline">
											Abonos
										</Typography>
										<Typography variant="h6">{totalTransactions}</Typography>
									</div>
									<div>
										<Typography color="text.secondary" variant="overline">
											Total Pagado
										</Typography>
										<Typography variant="h6">
											{new Intl.NumberFormat("en-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(amountPaid)}
										</Typography>
									</div>
									<div>
										<Typography color="text.secondary" variant="overline">
											Saldo
										</Typography>
										<Typography variant="h6">
											{new Intl.NumberFormat("en-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(amountToPay - amountPaid)}
										</Typography>
									</div>
									<div>
										<Typography color="text.secondary" variant="overline">
											Total a pagar
										</Typography>
										<Typography variant="h6">
											{new Intl.NumberFormat("en-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(amountToPay)}
										</Typography>
									</div>
									<div>
										<Typography color="text.secondary" variant="overline">
											Total Prestado
										</Typography>
										<Typography variant="h6">
											{new Intl.NumberFormat("en-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
											}).format(requestedAmount)}
										</Typography>
									</div>
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
		</React.Fragment>
	);
}
