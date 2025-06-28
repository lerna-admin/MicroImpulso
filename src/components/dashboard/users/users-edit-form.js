"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/app/dashboard/users/hooks/use-users";
import { capitalizeWord } from "@/helpers/format-words";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CardActions, MenuItem, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function UserEditForm({ roles, branches, user, userLogged }) {
	const [showPassword, setShowPassword] = React.useState();

	const router = useRouter();

	const schema = zod.object({
		name: zod
			.string()
			.min(3, { message: "Debe tener al menos 3 caracteres" })
			.max(100, { message: "Máximo 100 caracteres" })
			.regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
				message: "Debe ingresar nombre y apellido, solo letras y espacios",
			}),
		document: zod
			.string()
			.min(5, { message: "El documento es obligatorio" })
			.max(20, { message: "El documento es muy largo" })
			.regex(/^\d+$/, {
				message: "El documento debe contener solo números",
			}),
		password: zod
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres")
			.refine((val) => /[a-zA-Z]/.test(val), {
				message: "La contraseña debe contener al menos una letra",
			})
			.refine((val) => /[0-9]/.test(val), {
				message: "La contraseña debe contener al menos un número",
			}),
		email: zod
			.string()
			.email("Debe ser un correo válido")
			.min(5, "El correo es obligatorio")
			.max(255, "El correo es muy largo"),

		role: zod.string().min(1, "Debes seleccionar un rol"),
		branchId: zod
			.string()
			.or(zod.number().transform(String))
			.transform(String)
			.refine((val) => val.length > 0, {
				message: "Debes seleccionar una sede",
			}),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: user.name,
			document: user.document,
			password: user.password,
			email: user.email,
			role: user.role,
			branchId: user.branchId,
		},
		resolver: zodResolver(schema),
	});

	const role = useWatch({
		control,
		name: "role",
	});

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	React.useEffect(() => {
		if (user) {
			reset({
				name: user.name,
				document: user.document,
				password: user.password,
				email: user.email,
				role: user.role,
				branchId: user.branchId,
			});
		}
	}, [user]);

	const onSubmit = React.useCallback(async (dataForm) => {
		try {
			await updateUser({ ...dataForm, id: user.id });
			setAlertMsg("¡Actualizado exitosamente!");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			router.refresh();
			reset();
		}
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" paddingTop={3}>
							Editar usuario
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
										name="password"
										render={({ field }) => (
											<FormControl error={Boolean(errors.password)} fullWidth>
												<InputLabel required>Contraseña</InputLabel>
												<OutlinedInput
													{...field}
													endAdornment={
														showPassword ? (
															<EyeIcon
																cursor="pointer"
																fontSize="var(--icon-fontSize-md)"
																onClick={() => {
																	setShowPassword(false);
																}}
															/>
														) : (
															<EyeSlashIcon
																cursor="pointer"
																fontSize="var(--icon-fontSize-md)"
																onClick={() => {
																	setShowPassword(true);
																}}
															/>
														)
													}
													type={showPassword ? "text" : "password"}
												/>
												{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
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
										name="role"
										render={({ field }) => (
											<FormControl error={Boolean(errors.role)} fullWidth>
												<InputLabel required>Rol</InputLabel>
												<Select {...field}>
													{roles.map((rol) => (
														<MenuItem key={rol.id} value={rol.key}>
															{capitalizeWord(rol.value)}
														</MenuItem>
													))}
												</Select>
												{errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
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
										name="branchId"
										render={({ field }) => (
											<FormControl error={Boolean(errors.branchId)} fullWidth>
												<InputLabel required>Sede</InputLabel>
												<Select {...field} disabled={userLogged.role === "ADMIN"}>
													{!(role === "MANAGER" || role === "CENTRAL") &&
														branches.map((branch) => (
															<MenuItem key={branch.id} value={branch.id}>
																{branch.name}
															</MenuItem>
														))}
												</Select>
												{errors.branchId ? <FormHelperText>{errors.branchId.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</CardContent>
					<CardActions sx={{ justifyContent: "flex-end" }}>
						<Button variant="outlined" href={paths.dashboard.users.list}>
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
