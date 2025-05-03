"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, Link } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlash as EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { signInWithPassword } from "@/lib/custom-auth/actions";
import { useAuth } from "@/components/auth/custom/auth-context";
import { DynamicLogo } from "@/components/core/logo";

const schema = zod.object({
	email: zod.string().min(1, { message: "Usuario es obligatorio." }).email(),
	password: zod.string().min(1, { message: "Contraseña es obligatoria." }),
});

const defaultValues = { email: "", password: "" };

export function SignInForm() {
	const router = useRouter();
	const auth = useAuth();
	const [showPassword, setShowPassword] = React.useState();
	const [isPending, setIsPending] = React.useState(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (values) => {
			setIsPending(true);

			const { data, error } = await signInWithPassword(values);

			if (error) {
				setError("root", { type: "server", message: error });
				setIsPending(false);
				return;
			}

			// Update the user in the auth context so client components that depend on it can re-render.
			auth.setUser(data.user);

			// On router refresh the sign-in page component will automatically redirect to the dashboard.
			router.refresh();
		},
		[auth, router, setError]
	);

	return (
		<Stack spacing={4}>
			<Card>
				<CardHeader
					subheader={
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Box sx={{ display: "inline-flex", textDecoration: "none" }}>
								<DynamicLogo colorDark="light" colorLight="dark" height={73} width={73} />
								<Typography variant="body2" color="initial" alignContent={"center"} fontWeight={"bold"} fontSize={23}>
									icroimpulso
								</Typography>
							</Box>
						</div>
					}
				></CardHeader>
				<CardContent>
					<Stack spacing={2}>
						<Stack spacing={2}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Stack spacing={2}>
									<Controller
										control={control}
										name="email"
										render={({ field }) => (
											<FormControl error={Boolean(errors.email)}>
												<InputLabel>Usuario</InputLabel>
												<OutlinedInput {...field} type="email" />
												{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
									<Controller
										control={control}
										name="password"
										render={({ field }) => (
											<FormControl error={Boolean(errors.password)}>
												<InputLabel>Contraseña</InputLabel>
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
									{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
									<Button disabled={isPending} type="submit" variant="contained">
										Iniciar sesión
									</Button>
								</Stack>
							</form>
						</Stack>
						<div>
							<Link variant="subtitle2">¿Olvidaste la contraseña?</Link>
						</div>
					</Stack>
				</CardContent>
			</Card>
		</Stack>
	);
}
