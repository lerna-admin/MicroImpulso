"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chip, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

function formatearCantidad(valor) {
	const numero = Number(valor);

	const resultado = numero / 1000;

	return `${resultado.toString().replace(/\.0+$/, "")}X1`;
}

export function RequestEditForm({ dataRequest }) {

	const router = useRouter();
	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const schema = zod.object({
		amount: zod
			.number({ invalid_type_error: "El monto debe ser un número" })
			.min(1, { message: "El monto es obligatorio" })
			.min(50, { message: "El monto debe superar los $50.000" })
			.max(5_000_000, { message: "El monto no puede superar los 5.000.000" }),
		typePayment: zod.enum(["QUINCENAL", "MENSUAL"], { errorMap: () => ({ message: "Debes elegir un tipo de pago" }) }),
		datePayment: zod.enum(["15-30", "5-20", "10-25", "3-18"], {
			errorMap: () => ({ message: "Debes elegir una fecha de pago" }),
		}),
		selectedDate: zod
			.custom((val) => dayjs.isDayjs(val) && val.isValid(), {
				message: "La fecha es obligatoria",
			})
			.refine((val) => dayjs(val).isAfter(dayjs(), "day"), {
				message: "La fecha debe ser posterior a hoy",
			}),
	});

	const defaultValues = {
		amount: dataRequest.amount,
		typePayment: dataRequest.type,
		datePayment: dataRequest.paymentDay,
		selectedDate: dayjs(dataRequest.endDateAt),
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(async (dataForm) => {
		try {
			const bodyRequest = {
				endDateAt: dataForm.selectedDate.format("YYYY-MM-DD"),
				requestedAmount: dataForm.amount,
				paymentDay: dataForm.datePayment,
				type: dataForm.typePayment,
				amount: dataForm.amount * 1.2,
				mode: formatearCantidad(dataForm.amount),
			};
			await updateRequest(bodyRequest, dataRequest.id);
			setAlertMsg("¡Editado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			reset();
			router.push(paths.dashboard.customers.list);
		}
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardContent>
					<Stack spacing={1}>
						<Typography variant="h5" paddingTop={3}>
							Editar solicitud
						</Typography>
						<Typography variant="subtitle1">{dataRequest.client.name}</Typography>
					</Stack>

					<Chip
						label={dataRequest.agent.name}
						variant="filled"
						color="success"
						size="small"
						sx={{ marginTop: 1 }}
					></Chip>

					<Stack spacing={3} paddingTop={3}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="amount"
									render={({ field }) => {
										return (
											<FormControl error={Boolean(errors.amount)} fullWidth>
												<InputLabel required>Monto solicitado</InputLabel>
												<OutlinedInput
													{...field}
													value={field.value !== undefined && field.value !== null ? formatCurrency(field.value) : ""}
													onChange={(e) => {
														const raw = deleteAlphabeticals(e.target.value);
														const numericValue = raw ? Number.parseInt(raw, 10) : 0;
														field.onChange(numericValue);
													}}
													inputProps={{ inputMode: "numeric" }}
												/>
												{errors.amount ? <FormHelperText>{errors.amount.message}</FormHelperText> : null}
											</FormControl>
										);
									}}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="typePayment"
									render={({ field }) => (
										<FormControl error={Boolean(errors.typePayment)} fullWidth>
											<InputLabel required>Tipo de pago</InputLabel>
											<Select {...field}>
												<MenuItem value="QUINCENAL">Quincenal</MenuItem>
												<MenuItem value="MENSUAL">Mensual</MenuItem>
											</Select>
											{errors.typePayment ? <FormHelperText>{errors.typePayment.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="datePayment"
									render={({ field }) => (
										<FormControl error={Boolean(errors.datePayment)} fullWidth>
											<InputLabel required>Fecha de pago</InputLabel>
											<Select {...field}>
												<MenuItem value="15-30">15 - 30</MenuItem>
												<MenuItem value="5-20">5 - 20</MenuItem>
												<MenuItem value="10-25">10 - 25</MenuItem>
												<MenuItem value="3-18">3 - 18</MenuItem>
												
											</Select>
											{errors.datePayment ? <FormHelperText>{errors.datePayment.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="selectedDate"
									render={({ field }) => (
										<FormControl error={Boolean(errors.selectedDate)} fullWidth>
											<InputLabel required>Dia a pagar</InputLabel>
											<DatePicker {...field} minDate={dayjs()} sx={{ marginTop: "0.5rem" }} />
											{errors.selectedDate ? <FormHelperText>{errors.selectedDate.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
						</Grid>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button variant="contained" type="submit">
						Guardar
					</Button>
					<Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list}>
						Cancelar
					</Button>
				</CardActions>
			</Card>
			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</form>
	);
}
