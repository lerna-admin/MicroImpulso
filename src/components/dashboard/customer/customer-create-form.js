"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { createRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, Typography } from "@mui/material";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { logger } from "@/lib/default-logger";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

const schema = zod.object({
	name: zod
		.string()
		.min(3, { message: "Debe tener al menos 3 caracteres" })
		.max(100, { message: "Máximo 100 caracteres" })
		.regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
			message: "Debe ingresar nombre y apellido, solo letras y espacios",
		}),
	email: zod
		.string()
		.email("Debe ser un correo válido")
		.min(5, "El correo es obligatorio")
		.max(255, "El correo es muy largo"),

	phone: zod.string().min(7, "El celular es obligatorio").max(10, "El celular es muy largo").regex(/^\d+$/, {
		message: "El celular debe contener solo números",
	}),

	documentType: zod.enum(["CC", "CE", "TE"], {
		errorMap: () => ({ message: "Debes elegir un tipo de documento" }),
	}),
	document: zod
		.string()
		.min(5, { message: "El documento es obligatorio" })
		.max(20, { message: "El documento es muy largo" })
		.regex(/^\d+$/, {
			message: "El documento debe contener solo números",
		}),

	address: zod
		.string()
		.min(5, { message: "La dirección es obligatoria" })
		.max(255, { message: "La dirección es muy larga" }),
	amount: zod
		.number({ invalid_type_error: "El monto debe ser un número" })
		.min(1, { message: "El monto es obligatorio" })
		.max(5_000_000, { message: "El monto no puede superar los 5.000.000" }),
	typePayment: zod.enum(["QUINCENAL", "MENSUAL"], { errorMap: () => ({ message: "Debes elegir un tipo de pago" }) }),
	datePayment: zod.enum(["15-30", "5-20", "10-25"], {
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
	name: "",
	email: "",
	phone: "",
	documentType: "",
	document: "",
	address: "",
	amount: 0,
	typePayment: "",
	datePayment: "",
	selectedDate: dayjs(),
};

const determinarAgent = (user) => {
	if (user.role === "AGENT") {
		return user.id;
	}
	return null;
};

export function CustomerCreateForm({ user }) {
	const router = useRouter();
	const popoverAlert = usePopover();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const onSubmit = React.useCallback(
		async (dataForm) => {
			const bodyCustomer = {
				name: dataForm.name,
				email: dataForm.email,
				phone: dataForm.phone,
				documentType: dataForm.documentType,
				document: dataForm.document,
				address: dataForm.address,
				status: "PROSPECT",
			};
			createCustomer(bodyCustomer)
				.then(({ id: newClientId }) => {
					const bodyRequest = {
						client: newClientId,
						agent: determinarAgent(user),
						status: "new",
						requestedAmount: dataForm.amount,
						endDateAt: dataForm.selectedDate,
						amount: 0,
						paymentDay: dataForm.datePayment,
						type: dataForm.typePayment,
					};
					return createRequest(bodyRequest);
				})
				.then(() => {
					setAlertMsg("¡Creado exitosamente!");
					setAlertSeverity("success");
				})
				.catch((error) => {
					setAlertMsg(error.message);
					setAlertSeverity("error");
					logger.error(error);
				})
				.finally(() => {
					popoverAlert.handleOpen();
					reset();
				});
		},
		[router]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" paddingTop={3}>
							Crear cliente
						</Typography>

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
										name="name"
										render={({ field }) => (
											<FormControl error={Boolean(errors.name)} fullWidth>
												<InputLabel required>Nombre completo</InputLabel>
												<OutlinedInput {...field} />
												{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
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
										name="email"
										render={({ field }) => (
											<FormControl error={Boolean(errors.email)} fullWidth>
												<InputLabel required>Correo</InputLabel>
												<OutlinedInput {...field} type="email" />
												{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
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
										name="documentType"
										render={({ field }) => (
											<FormControl error={Boolean(errors.documentType)} fullWidth>
												<InputLabel required>Tipo de documento</InputLabel>
												<Select {...field}>
													<MenuItem value="CC">Cedula de Ciudadania</MenuItem>
													<MenuItem value="CE">Cedula de Extranjeria</MenuItem>
													<MenuItem value="TE">Tarjeta de extranjería</MenuItem>
												</Select>
												{errors.documentType ? <FormHelperText>{errors.documentType.message}</FormHelperText> : null}
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
										name="document"
										render={({ field }) => (
											<FormControl error={Boolean(errors.document)} fullWidth>
												<InputLabel required>N. de documento</InputLabel>
												<OutlinedInput {...field} />
												{errors.document ? <FormHelperText>{errors.document.message}</FormHelperText> : null}
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
										name="phone"
										render={({ field }) => (
											<FormControl error={Boolean(errors.phone)} fullWidth>
												<InputLabel required>N. de celular</InputLabel>
												<OutlinedInput {...field} />
												{errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
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
										name="address"
										render={({ field }) => (
											<FormControl error={Boolean(errors.address)} fullWidth>
												<InputLabel required>Dirección</InputLabel>
												<OutlinedInput {...field} />
												{errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</CardContent>
				</Card>
				<Card>
					<CardContent>
						<Typography variant="h5" paddingTop={3}>
							Crear solicitud
						</Typography>

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
						<Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list}>
							Cancelar
						</Button>
						<Button variant="contained" type="subnmit">
							Guardar
						</Button>
					</CardActions>
				</Card>
			</Stack>

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</form>
	);
}
