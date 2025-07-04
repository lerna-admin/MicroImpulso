"use client";

import * as React from "react";
import RouterLink from "next/link";
import { createBranch } from "@/app/dashboard/configuration/branch-managment/hooks/use-branches";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CardActions, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function BranchCreateForm() {
	const popoverAlert = usePopover();

	const schema = zod.object({
		name: zod
			.string()
			.min(3, { message: "Debe tener al menos 3 caracteres" })
			.max(100, { message: "Máximo 100 caracteres" }),
	});

	const defaultValues = {
		name: "",
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");

	const onSubmit = React.useCallback(
		async (dataForm) => {
			try {
				await createBranch(dataForm);
				setAlertMsg("¡Creado exitosamente!");
				setAlertSeverity("success");
			} catch (error) {
				setAlertMsg(error.message);
				setAlertSeverity("error");
			} finally {
				popoverAlert.handleOpen();
				reset();
			}
		},
		[popoverAlert, reset]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={4}>
				<Card>
					<CardContent>
						<Typography variant="h5" paddingTop={3}>
							Crear sede
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
												<InputLabel required>Nombre</InputLabel>
												<OutlinedInput {...field} />
												{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</CardContent>
					<CardActions sx={{ justifyContent: "flex-end" }}>
						<Button variant="outlined" component={RouterLink} href={paths.dashboard.configuration.branchManagment.list}>
							Cancelar
						</Button>
						<Button variant="contained" type="submit">
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
