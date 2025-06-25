"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid2 as Grid,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { updateConfigParam } from "@/hooks/use-config";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function AmountManagment({ params }) {
	const router = useRouter();
	const notificationAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");
	const [isDisabled, setIsDisabled] = React.useState(true);
	const { fundedLimit, invoiceLimit } = params;

	const schema = zod.object({
		fundedLimit: zod.preprocess(
			(val) => (val === "" ? undefined : Number(val)),
			zod
				.number({
					required_error: "El límite de prestamos individuales es obligatorio",
					invalid_type_error: "Debe ser un número",
				})
				.gt(0, { message: "Debe ser mayor a 0" })
		),
		invoiceLimit: zod.preprocess(
			(val) => (val === "" ? undefined : Number(val)),
			zod
				.number({
					required_error: "El límite de prestamos facturables es obligatorio",
					invalid_type_error: "Debe ser un número",
				})
				.gt(0, { message: "Debe ser mayor a 0" })
		),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			fundedLimit: fundedLimit.value,
			invoiceLimit: invoiceLimit.value,
		},
	});

	const onSubmit = async (dataForm) => {
		for (const key of Object.keys(dataForm)) {
			try {
				await updateConfigParam(key, { value: dataForm[key] });
				setAlertMsg("¡Guardado exitosamente!");
				setAlertSeverity("success");
			} catch (error) {
				setAlertMsg(error.message);
				setAlertSeverity("error");
			} finally {
				notificationAlert.handleOpen();
				router.refresh();
			}
		}
	};

	React.useEffect(() => {
		if (params) {
			reset({
				fundedLimit: fundedLimit.value,
				invoiceLimit: invoiceLimit.value,
			});
		}
	}, [params]);

	return (
		<Box component={"form"} onSubmit={handleSubmit(onSubmit)} padding={3}>
			<Grid container spacing={3}>
				<Grid size={{ md: 6, xs: 12 }}>
					<Controller
						control={control}
						name="fundedLimit"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.fundedLimit)} disabled={isDisabled}>
								<Stack spacing={0.5} mb={2}>
									<InputLabel required>Limite maximo de prestamos individuales</InputLabel>
									<Typography variant="caption" color="grey">
										Esto indica que cantidad maxima puede prestar un agente.
									</Typography>
								</Stack>
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
								{errors.fundedLimit ? <FormHelperText>{errors.fundedLimit.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid>
				<Grid size={{ md: 6, xs: 12 }}>
					<Controller
						control={control}
						name="invoiceLimit"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.invoiceLimit)} disabled={isDisabled}>
								<Stack spacing={0.5} mb={2}>
									<InputLabel required>Limite maximo de prestamos facturables</InputLabel>
									<Typography variant="caption" color="grey">
										Esto indica que cantidad maxima puede prestar todos los agentes.
									</Typography>
								</Stack>
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
								{errors.invoiceLimit ? <FormHelperText>{errors.invoiceLimit.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
						{isDisabled ? (
							<Button color="secondary" variant="outlined" onClick={() => setIsDisabled(!isDisabled)}>
								Editar
							</Button>
						) : (
							<Button
								color="secondary"
								variant="outlined"
								onClick={() => {
									setIsDisabled(!isDisabled);
									reset();
								}}
							>
								Cancelar
							</Button>
						)}

						<Button variant="contained" type="submit">
							Guardar
						</Button>
					</Stack>
				</Grid>
			</Grid>
			<NotificationAlert
				openAlert={notificationAlert.open}
				onClose={notificationAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</Box>
	);
}
