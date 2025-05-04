import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { CenteredLayout } from "@/components/auth/centered-layout";
import { DynamicLogo } from "@/components/core/logo";

export const metadata = { title: `Iniciar sesión | Auth | ${appConfig.name}` };

export default function Page() {
	return (
		<CenteredLayout>
			<Stack spacing={4}>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Box sx={{ display: "inline-flex", textDecoration: "none" }}>
						<DynamicLogo colorDark="light" colorLight="dark" height={70} width={70} />
						<Typography variant="body1" color="black" alignContent={"center"} fontWeight={"bold"}>
							icroImpulso
						</Typography>
					</Box>
				</div>
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Stack spacing={2}>
								<FormControl>
									<InputLabel>Usuario</InputLabel>
									<OutlinedInput name="email" type="email" />
								</FormControl>
								<FormControl>
									<InputLabel>Contraseña</InputLabel>
									<OutlinedInput name="password" type="password" />
								</FormControl>
								<Button type="submit" variant="contained">
									Iniciar sesión
								</Button>
							</Stack>
							<div>
								<Link variant="subtitle2">¿Olvidaste la contraseña?</Link>
							</div>
						</Stack>
					</CardContent>
				</Card>
			</Stack>
		</CenteredLayout>
	);
}
