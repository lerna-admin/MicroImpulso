"use client";

import * as React from "react";
import { Box, Chip, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Smiley } from "@phosphor-icons/react/dist/ssr";

export function TemplateForm() {
	const [chipData, setChipData] = React.useState([
		{ key: 0, label: "Angular" },
		{ key: 1, label: "jQuery" },
		{ key: 2, label: "Polymer" },
		{ key: 3, label: "React" },
		{ key: 4, label: "Vue.js" },
	]);

	const [newField, setNewField] = React.useState("");

	const handleDelete = (chipToDelete) => () => {
		setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
	};

	const handleNewField = ({ target }) => {
		setNewField(target.value);
	};

	return (
		<Box padding={3}>
			<Typography variant="body2" color="initial">
				Campos:
			</Typography>
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
				{chipData.map((data) => {
					let icon;

					if (data.label === "React") {
						icon = <Smiley />;
					}

					return (
						<ListItem key={data.key}>
							<Chip icon={icon} label={data.label} onDelete={data.label === "React" ? undefined : handleDelete(data)} />
						</ListItem>
					);
				})}
			</Box>
			<TextField label="Añadir campo" value={newField} onChange={(e) => handleNewField(e)} />
		</Box>
	);
}

const ListItem = styled("li")(({ theme }) => ({
	margin: theme.spacing(0.5),
}));
