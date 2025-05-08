import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import { paths } from "@/paths";

export const metadata = { title: `No encontrada | Errors | ${appConfig.name}` };

export default function Page() {
	return (
		<Box
			component="main"
			sx={{
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				minHeight: "100%",
				py: "64px",
			}}
		>
			<Container maxWidth="lg">
				<Stack spacing={6}>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Box
							alt="Not found"
							component="img"
							src="/assets/not-found.svg"
							sx={{ height: "auto", maxWidth: "100%", width: "200px" }}
						/>
					</Box>
					<Stack spacing={1} sx={{ textAlign: "center" }}>
						<Typography variant="h4">404: La pagina que estas buscando no esta aqui</Typography>
						<Typography color="text.secondary">
							Probaste una ruta sospechosa o llegaste aquí por error. Sea como sea, intenta usar la navegación.
						</Typography>
					</Stack>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Button component={RouterLink} href={paths.home} variant="contained">
							Volver al inicio
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
