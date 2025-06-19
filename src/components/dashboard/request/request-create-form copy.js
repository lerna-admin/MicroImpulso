"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { getAllCustomers } from "@/app/dashboard/customers/hooks/use-customers";
import { createRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, CircularProgress, Divider, MenuItem, TextField } from "@mui/material";
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
import { debounce } from "@mui/material/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

const schema = zod.object({
	customer: zod.any(),
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
	customer: [],
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

export function RequestCreateForm({ user }) {
	const router = useRouter();
	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const [inputValue, setInputValue] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (dataForm) => {
			try {
				const bodyRequest = {
					clientId: 241,
					agentId: determinarAgent(user),
					status: "NEW",
					requestedAmount: dataForm.amount,
					endDateAt: dataForm.selectedDate,
					amount: 0,
					paymentDay: dataForm.datePayment,
					type: dataForm.typePayment,
				};
				await createRequest(bodyRequest);
				setAlertMsg("¡Creado exitosamente!");
				setAlertSeverity("success");
				reset();
			} catch (error) {
				setAlertMsg(error.message);
				setAlertSeverity("error");
			}
		},
		[router]
	);

	const fetchOptions = async (query) => {
		if (!query) return [];
		const { data } = await getAllCustomers({ name: query });
		return data.filter((item) => item.client.name.toLowerCase().includes(query.toLowerCase()));
	};

	const debouncedFetch = React.useMemo(
		() =>
			debounce(async (query, callback) => {
				setLoading(true);
				const results = await fetchOptions(query);
				callback(results);
				setLoading(false);
			}, 400),
		[]
	);

	React.useEffect(() => {
		if (inputValue === "") {
			setValue("customer", []);
			return;
		}

		debouncedFetch(inputValue, (results) => {
			setValue("customer", [results]);
		});
	}, [inputValue, debouncedFetch]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardContent>
					<Typography variant="h5" paddingTop={3}>
						Crear solicitud
					</Typography>

					<Stack spacing={3} paddingTop={3} divider={<Divider />}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="customer"
									render={({ field }) => (
										<FormControl error={Boolean(errors.customer)} fullWidth>
											<Autocomplete
												{...field}
												freeSolo
												options={field.value}
												loading={loading}
												getOptionLabel={(option) => (typeof option === "string" ? option : (option.client?.name ?? ""))}
												value={field.value}
												onChange={(_, newValue) => field.onChange(newValue)}
												inputValue={inputValue}
												onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
												isOptionEqualToValue={(option, value) => option?.id === value?.id}
												renderInput={(params) => <TextField {...params} label="Cliente" variant="outlined" />}
											/>
											{errors.customer ? <FormHelperText>{errors.customer.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
						</Grid>
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
					<Button variant="contained" type="submit">
						Guardar
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
