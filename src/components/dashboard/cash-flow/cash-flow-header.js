"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createCashMovement } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import { formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	Building as BuildingIcon,
	Plus as PlusIcon,
	TrendDown as TrendDownIcon,
	TrendUp as TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z as zod } from "zod";

import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

const schema = zod.object({
	amount: zod
		.string()
		.min(1, "El monto es obligatorio")
		.transform((val) => val.replaceAll(/\D/g, ""))
		.transform(Number)
		.refine((val) => Number.isInteger(val) && val > 0, {
			message: "Debe ser un número entero mayor a 0",
		}),
	typeMovement: zod.string().min(1, { message: "El tipo de movimiento es obligatorio" }),
	category: zod.string().min(1, { message: "La categoria es obligatoria" }),
	description: zod.string().min(1, { message: "La descripción es obligatoria" }),
});

export function CashFlowHeader({ branch }) {
	const popover = usePopover();
	const router = useRouter();

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			amount: "",
			typeMovement: "",
			category: "",
			description: "",
		},
	});

	const typeMovement = useWatch({
		control,
		name: "typeMovement",
	});

	const onSubmit = React.useCallback(async (dataForm) => {
		setIsPending(true);

		try {
			await createCashMovement({
				typeMovement: dataForm.typeMovement,
				amount: dataForm.amount,
				category: dataForm.category,
				description: dataForm.description,
			});
			setAlertMsg("¡Movimiento creado exitosamente!");
			setAlertSeverity("success");
			popover.handleClose();

			reset();
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}

		popoverAlert.handleOpen();
		setIsPending(false);
		router.refresh();
	});

	return (
		<React.Fragment>
			{/* Titulos */}
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Movimientos de caja</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box padding={1} paddingRight={0}>
						<BuildingIcon />
					</Box>
					<Typography padding={1} variant="body2">
						{`Sede ${branch}`}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button color="secondary" startIcon={<PlusIcon />} variant="contained" onClick={popover.handleOpen}>
						Registrar movimiento
					</Button>
				</Box>
			</Stack>

			{/* Modal para renovar solicitud */}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={popover.open}
				onClose={popover.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Añadir nuevo movimiento"}
				</DialogTitle>

				<DialogContent>
					<Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
						<Stack spacing={3} sx={{ p: 3 }}>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 12,
										xs: 12,
									}}
								>
									<Controller
										control={control}
										name="typeMovement"
										render={({ field }) => (
											<FormControl fullWidth error={Boolean(errors.typeMovement)}>
												<InputLabel id="type-movement">Tipo de movimiento</InputLabel>
												<Select {...field} labelId="type-movement">
													<MenuItem value="ENTRADA">
														<Stack direction="row" alignItems="center" spacing={1}>
															<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
															<Typography>Entrada</Typography>
														</Stack>
													</MenuItem>
													<MenuItem value="SALIDA">
														<Stack direction="row" alignItems="center" spacing={1}>
															<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
															<Typography>Salida</Typography>
														</Stack>
													</MenuItem>
												</Select>
												{errors.typeMovement ? <FormHelperText>{errors.typeMovement.message}</FormHelperText> : null}
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
									<Controller
										control={control}
										name="amount"
										render={({ field }) => (
											<FormControl fullWidth error={Boolean(errors.amount)}>
												<TextField
													{...field}
													label="Monto"
													variant="outlined"
													onChange={(e) => {
														const formatted = formatCurrency(e.target.value);
														field.onChange(formatted);
													}}
													onKeyDown={(e) => {
														const isNumberKey = /^[0-9]$/.test(e.key);
														const isControlKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(
															e.key
														);
														if (!isNumberKey && !isControlKey) e.preventDefault();
													}}
												/>
												{errors.amount ? <FormHelperText>{errors.amount.message}</FormHelperText> : null}
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
									<Controller
										control={control}
										name="category"
										render={({ field }) => (
											<FormControl fullWidth error={Boolean(errors.category)} disabled={!typeMovement}>
												<InputLabel id="category">Categoria</InputLabel>
												<Select labelId="category" {...field}>
													{typeMovement === "ENTRADA"
														? [
																<MenuItem key="COBRO_CLIENTE" value="COBRO_CLIENTE">
																	Cobro
																</MenuItem>,
																<MenuItem key="ENTRADA_GERENCIA" value="ENTRADA_GERENCIA">
																	Entrada caja
																</MenuItem>,
															]
														: typeMovement === "SALIDA"
															? [
																	<MenuItem key="PRESTAMO" value="PRESTAMO">
																		Préstamos
																	</MenuItem>,
																	<MenuItem key="GASTO_PROVEEDOR" value="GASTO_PROVEEDOR">
																		Gastos
																	</MenuItem>,
																]
															: []}
												</Select>
												{errors.category ? <FormHelperText>{errors.category.message}</FormHelperText> : null}
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
									<Controller
										control={control}
										name="description"
										render={({ field }) => (
											<FormControl fullWidth error={Boolean(errors.description)}>
												<TextField
													label="Descripción"
													placeholder="Escribe una descripción..."
													multiline
													minRows={3}
													{...field}
													slotProps={{ htmlInput: { maxLength: 150 } }}
												/>
												{errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>

							<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2}>
								<Button variant="contained" type="submit" disabled={isPending}>
									Aceptar
								</Button>
								<Button
									variant="outlined"
									onClick={() => {
										popover.handleClose();
										reset();
									}}
								>
									Cancelar
								</Button>
							</Box>
						</Stack>
					</Box>
				</DialogContent>
			</Dialog>

			{/* Alertas */}
			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</React.Fragment>
	);
}
