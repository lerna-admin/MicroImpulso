"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Chip, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

export function TemplateForm() {
	const [variables, setVariables] = React.useState([{ id: "nombre", label: "nombre" }]);

	const schema = zod.object({
		newField: zod
			.string()
			.transform((val) => val.replaceAll(/\s+/g, "_")) // Reemplaza espacios por guiones bajos
			.refine((val) => val.length > 3, {
				message: "Debe tener más de 3 caracteres",
			})
			.refine((val) => val.length <= 20, {
				message: "No puede tener más de 20 caracteres",
			}),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			newField: "",
		},
		resolver: zodResolver(schema),
	});

	const handleDelete = (chipToDelete) => () => {
		setVariables((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
	};

	const handleAdd = ({ newField }) => {
		const found = variables.find((item) => item.id === newField.toLowerCase());
		// Si ya existe una variable con el mismo id sale de la func
		if (found) {
			reset();
			return;
		}

		const newVariable = { id: newField.toLowerCase(), label: newField.toLowerCase() };
		setVariables((prev) => [...prev, newVariable]);
		reset();
	};

	return (
		<Box padding={3}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
					listStyle: "none",
					p: 0.5,
					m: 0,
				}}
				component="ul"
			>
				{variables.map((item) => {
					return (
						<ListItem key={item.id}>
							<Chip label={item.label} onDelete={handleDelete(item)} />
						</ListItem>
					);
				})}
			</Box>
			<form onSubmit={handleSubmit(handleAdd)}>
				<Stack spacing={2} direction={"column"} alignItems={"start"} paddingTop={3}>
					<Controller
						control={control}
						name="newField"
						render={({ field }) => (
							<FormControl error={Boolean(errors.newField)}>
								<InputLabel required>Nueva variable</InputLabel>
								<OutlinedInput {...field} />
								{errors.newField ? <FormHelperText>{errors.newField.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>

					<Button variant="contained" color="primary" type="submit">
						Añadir
					</Button>
				</Stack>
			</form>
		</Box>
	);
}

const ListItem = styled("li")(({ theme }) => ({
	margin: theme.spacing(0.5),
}));
