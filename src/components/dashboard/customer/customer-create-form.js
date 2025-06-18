"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
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
});

const defaultValues = {
	name: "",
	email: "",
	phone: "",
	documentType: "",
	document: "",
	address: "",
};

export function CustomerCreateForm() {
	const router = useRouter();
	const popoverAlert = usePopover();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const onSubmit = React.useCallback(
		async (dataForm) => {
			try {
				dataForm = { ...dataForm, status: "PROSPECT" };
				await createCustomer(dataForm);
				setAlertMsg("¡Creado exitosamente!");
				setAlertSeverity("success");
				setTimeout(() => {
					router.push(paths.dashboard.customers.list);
				}, 2000);
			} catch (error) {
				setAlertMsg(error.message);
				setAlertSeverity("error");
				logger.error(error);
			}
			popoverAlert.handleOpen();
		},
		[router]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardContent>
					<Stack divider={<Divider />} spacing={4}>
						<Stack spacing={3}>
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
												<InputLabel>Dirección</InputLabel>
												<OutlinedInput {...field} />
												{errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained">
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
