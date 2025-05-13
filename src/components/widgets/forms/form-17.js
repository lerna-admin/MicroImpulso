import * as React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { Option } from "@/components/core/option";
import { ChatContext } from "@/components/dashboard/chat/chat-context";

export function Form17() {
	const { setOpenDesktopSidebarRight } = React.useContext(ChatContext);

	return (
		<Stack spacing={4} sx={{ p: 3 }}>
			<Grid container spacing={3}>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<FormControl fullWidth>
						<InputLabel required>Nombre Completo</InputLabel>
						<OutlinedInput defaultValue="" name="name" />
					</FormControl>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<FormControl fullWidth>
						<InputLabel required>Tipo de Documento</InputLabel>
						<Select displayEmpty={true} name="document">
							<Option value="cc">Cedula de Ciudadania</Option>
							<Option value="ce">Cedula de Extranjeria</Option>
							<Option value="te">Tarjeta de extranjería</Option>
						</Select>
					</FormControl>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<FormControl fullWidth>
						<InputLabel required>Cedula</InputLabel>
						<OutlinedInput defaultValue="" name="address" />
					</FormControl>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<FormControl fullWidth>
						<InputLabel required>Dirección</InputLabel>
						<OutlinedInput defaultValue="" name="address" />
					</FormControl>
				</Grid>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<FormControl fullWidth>
						<InputLabel required>Numero Celular</InputLabel>
						<OutlinedInput defaultValue="(315) 434-5535" name="phone" />
					</FormControl>
				</Grid>
			</Grid>

			<Grid
				size={{
					md: 6,
					xs: 12,
				}}
			>
				<Button
					variant="contained"
					onClick={() => {
						setOpenDesktopSidebarRight((prev) => !prev);
					}}
				>
					Guardar Cliente
				</Button>
			</Grid>
		</Stack>
	);
}
