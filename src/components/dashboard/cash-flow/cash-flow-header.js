"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createCashMovement } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import { getBranchesById } from "@/app/dashboard/configuration/branch-managment/hooks/use-branches";
import { getAllUsers } from "@/app/dashboard/users/hooks/use-users";
import { ROLES } from "@/constants/roles";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { capitalizeWord } from "@/helpers/format-words";
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
	OutlinedInput,
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

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

dayjs.locale("es");
const schema = zod
	.object({
		amount: zod
			.number({ invalid_type_error: "El monto debe ser un número" })
			.min(1, { message: "El monto es obligatorio" }),
		typeMovement: zod.string().min(1, { message: "El tipo de movimiento es obligatorio" }),
		category: zod.string().min(1, { message: "La categoria es obligatoria" }),
		transferUser: zod.string().optional(),
		description: zod.string().min(1, { message: "La descripción es obligatoria" }),
	})
	.superRefine((data, ctx) => {
		if (data.category === "TRANSFERENCIA" && (!data.transferUser || data.transferUser.trim() === "")) {
			ctx.addIssue({
				path: ["transferUser"],
				code: zod.ZodIssueCode.custom,
				message: "Este campo es obligatorio para transferencias",
			});
		}
	});

export function CashFlowHeader({ user }) {
	const popover = usePopover();
	const router = useRouter();

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [isPending, setIsPending] = React.useState(false);

	const [usuariosOptions, setUsuariosOptions] = React.useState([]);

	const typeMovementOptions = [
		{ label: "ENTRADA", value: "ENTRADA" },
		{ label: "SALIDA", value: "SALIDA" },
		{ label: "TRANSFERENCIA", value: "TRANSFERENCIA" },
	];

	const categoryOptions = [
		{ label: "ENTRADA GERENCIA", value: "ENTRADA_GERENCIA", type: "ENTRADA" },
		{ label: "COBRO CLIENTE", value: "COBRO_CLIENTE", type: "ENTRADA" },
		{ label: "PRESTAMO ADMINISTRADOR", value: "PRESTAMO ADMINISTRADOR", type: "SALIDA" },
		{ label: "TRANSFERENCIA", value: "TRANSFERENCIA", type: "TRANSFERENCIA" },
		{ label: "GASTO PROVEEDOR", value: "GASTO_PROVEEDOR", type: "SALIDA" },
	];

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			amount: 0,
			typeMovement: "",
			category: "",
			transferUser: "",
			description: "",
		},
	});

	const typeMovement = useWatch({
		control,
		name: "typeMovement",
	});

	const category = useWatch({
		control,
		name: "category",
	});

React.useEffect(() => {
  if (category === "TRANSFERENCIA") {
    getBranchesById(user.branch.id)
      .then((resp) => {
        const { administrator, agents } = resp;
        if (user.role === ROLES.AGENTE) {
          setUsuariosOptions([administrator]);
        } else if (user.role === ROLES.ADMIN) {
        //   const agentsFiltered = agents.filter((agent) => agent.role === ROLES.AGENTE);
          setUsuariosOptions(agents);
        }
      })
      .catch((error) => {
        const message =
          typeof error === "string"
            ? error
            : error?.message
              ? error.message
              : "Ocurrió un error al obtener la sede";
        setAlertMsg(message);
        setAlertSeverity("error");
      })
      .finally(() => {
        popoverAlert.handleOpen();
      });
  } else if (category === "PRESTAMO ADMINISTRADOR") {
    getAllUsers({ role: "ADMIN" })
      .then((resp) => {
        const { data } = resp;
        const filteredAdmins = data.map((item) => ({ id: item.id, name: item.name }));
        setUsuariosOptions(filteredAdmins);
      })
      .catch((error) => {
        const message =
          typeof error === "string"
            ? error
            : error?.message
              ? error.message
              : "Ocurrió un error al obtener los administradores";
        setAlertMsg(message);
        setAlertSeverity("error");
      })
      .finally(() => {
        popoverAlert.handleOpen();
      });
  }
}, [category, user]);


	const onSubmit = async (dataForm) => {
		setIsPending(true);
		try {
			await createCashMovement({
				typeMovement: dataForm.typeMovement,
				category: dataForm.category,
				amount: dataForm.amount,
				description: dataForm.description,
				branchId: user.branch.id,
				origenId: user.id,
				destinoId: Number(dataForm.transferUser),
			});

			setAlertMsg("¡Movimiento creado exitosamente!");
			setAlertSeverity("success");
			popover.handleClose();
			reset();
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			setIsPending(false);
			router.refresh();
		}
	};

	return (
		<React.Fragment>
			<Stack spacing={3}>
				<Grid container spacing={4}>
					<Grid size={6}>
						{/* Título */}
						<Typography variant="h4">Movimientos de caja</Typography>
					</Grid>
					<Grid size={6} gap={3} display={"flex"} justifyContent={"flex-end"}>
						{/* Información de la sede */}
						<Stack direction="row" spacing={1} alignItems="center" pr={2}>
							<BuildingIcon />
							<Typography variant="body2">{`Sede ${user.branch.name}`}</Typography>
						</Stack>

						{/* Botón de acción */}
						<Button color="secondary" startIcon={<PlusIcon />} variant="contained" onClick={popover.handleOpen}>
							Registrar movimiento
						</Button>
					</Grid>
				</Grid>
			</Stack>

			{/* Modal para registrar movimiento */}
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
													{user.role === ROLES.AGENTE
														? typeMovementOptions
																.filter((option) => option.value === "SALIDA")
																.map((option) => (
																	<MenuItem key={option.value} value={option.value}>
																		<Stack direction="row" alignItems="center" spacing={1}>
																			{option.value === "ENTRADA" ? (
																				<TrendUpIcon
																					color="var(--mui-palette-success-main)"
																					fontSize="var(--icon-fontSize-md)"
																				/>
																			) : (
																				<TrendDownIcon
																					color="var(--mui-palette-error-main)"
																					fontSize="var(--icon-fontSize-md)"
																				/>
																			)}
																			<Typography>{capitalizeWord(option.label)}</Typography>
																		</Stack>
																	</MenuItem>
																))
														: user.role === ROLES.ADMIN
															? typeMovementOptions.map((option) => (
																	<MenuItem key={option.value} value={option.value}>
																		<Stack direction="row" alignItems="center" spacing={1}>
																			{option.value === "ENTRADA" ? (
																				<TrendUpIcon
																					color="var(--mui-palette-success-main)"
																					fontSize="var(--icon-fontSize-md)"
																				/>
																			) : option.value === "SALIDA" ? (
																				<TrendDownIcon
																					color="var(--mui-palette-error-main)"
																					fontSize="var(--icon-fontSize-md)"
																				/>
																			) : null}
																			<Typography>{capitalizeWord(option.label)}</Typography>
																		</Stack>
																	</MenuItem>
																))
															: typeMovementOptions
																	.filter((option) => option.value !== "TRANSFERENCIA")
																	.map((option) => (
																		<MenuItem key={option.value} value={option.value}>
																			<Stack direction="row" alignItems="center" spacing={1}>
																				{option.value === "ENTRADA" ? (
																					<TrendUpIcon
																						color="var(--mui-palette-success-main)"
																						fontSize="var(--icon-fontSize-md)"
																					/>
																				) : (
																					<TrendDownIcon
																						color="var(--mui-palette-error-main)"
																						fontSize="var(--icon-fontSize-md)"
																					/>
																				)}
																				<Typography>{capitalizeWord(option.label)}</Typography>
																			</Stack>
																		</MenuItem>
																	))}
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
												<InputLabel required>Monto</InputLabel>
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
													{user.role === ROLES.AGENTE
														? categoryOptions
																.filter((option) => option.value === "TRANSFERENCIA")
																.map((option) => (
																	<MenuItem key={option.value} value={option.value}>
																		{capitalizeWord(option.label)}
																	</MenuItem>
																))
														: categoryOptions
																.filter((option) => option.type === typeMovement)
																.map((option) => (
																	<MenuItem key={option.value} value={option.value}>
																		{capitalizeWord(option.label)}
																	</MenuItem>
																))}
												</Select>
												{errors.category ? <FormHelperText>{errors.category.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>

								{category === "TRANSFERENCIA" || category === "PRESTAMO ADMINISTRADOR" ? (
									<Grid
										size={{
											md: 12,
											xs: 12,
										}}
									>
										<Controller
											control={control}
											name="transferUser"
											render={({ field }) => (
												<FormControl fullWidth error={Boolean(errors.transferUser)} disabled={!typeMovement}>
													<InputLabel id="transferUser">
														{user.role === ROLES.AGENTE || user.role === ROLES.GERENTE || category === "PRESTAMO ADMINISTRADOR"? "Administrador" : "Agente"}
													</InputLabel>
													<Select labelId="transferUser" {...field}>
														{usuariosOptions.map((option) => (
															<MenuItem key={option.id} value={option.id.toString()}>
																{option.name}
															</MenuItem>
														))}
													</Select>
													{errors.transferUser ? <FormHelperText>{errors.transferUser.message}</FormHelperText> : null}
												</FormControl>
											)}
										/>
									</Grid>
								) : null}

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
