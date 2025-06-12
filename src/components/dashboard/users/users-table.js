"use client";

import * as React from "react";
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	ArrowCounterClockwise as ArrowCounterClockwiseIcon,
	DotsThree as DotsThreeIcon,
	ListChecks as ListChecksIcon,
} from "@phosphor-icons/react/dist/ssr";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

export function UsersTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Typography variant="subtitle2">{row.name}</Typography>
						<Typography color="text.secondary" variant="body2">
							{row.email}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{ field: "document", name: "Identificación", width: "150px" },
		{ field: "role", name: "Rol", width: "150px" },
		{
			formatter(row) {
				return dayjs(row.createdAt).format("MMM D, YYYY");
			},
			name: "Fecha creación",
			width: "150px",
		},
		{
			formatter(row) {
				return dayjs(row.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha actualizada",
			width: "150px",
		},

		{
			formatter: (row) => <ActionsCell row={row} />,
			name: "Acciones",
			hideName: true,
			width: "70px",
			align: "right",
		},
	];

	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No se encontraron usuarios
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}

export function ActionsCell({ row }) {
	const popover = usePopover();
	const modalPermisos = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [allowDisbursement, setAllowDisbursement] = React.useState(false);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleActions = () => {
		//TODO Peticion para traer los permisos del agente seleccionado
		console.log(row.id);
		modalPermisos.handleOpen();
	};

	const handleSaveChanges = () => {
		modalPermisos.handleClose();
		console.log("Permitir:", allowDisbursement);
	};

	const handleChange = (event) => {
		setAllowDisbursement(event.target.checked);
	};

	return (
		<React.Fragment>
			<Tooltip title="Más opciones">
				<IconButton onClick={handleOptions}>
					<DotsThreeIcon weight="bold" />
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				open={popover.open}
				onClose={popover.handleClose}
				slotProps={{ paper: { elevation: 0 } }}
			>
				<MenuItem onClick={handleActions}>
					<ListItemIcon>
						<ListChecksIcon />
					</ListItemIcon>
					<Typography>Acciones</Typography>
				</MenuItem>
				<MenuItem onClick={() => console.log("Pendiente")}>
					<ListItemIcon>
						<ArrowCounterClockwiseIcon />
					</ListItemIcon>
					<Typography>Revertir cierre del dia</Typography>
				</MenuItem>
			</Menu>

			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalPermisos.open}
				onClose={modalPermisos.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4, pb: 4 }}>
					{"Acciones"}
				</DialogTitle>

				<DialogContent>
					<Grid container spacing={3}>
						<Grid
							size={{
								md: 12,
								xs: 12,
							}}
						>
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											label
											checked={allowDisbursement}
											onChange={handleChange}
											inputProps={{ "aria-label": "controlled" }}
										/>
									}
									label="Permitir desembolsar"
								/>
							</FormGroup>
						</Grid>

						<Grid
							size={{
								md: 12,
								xs: 12,
							}}
							display={"flex"}
							justifyContent={"flex-end"}
							gap={2}
						>
							<Button variant="contained" onClick={handleSaveChanges} autoFocus>
								Guardar
							</Button>
							<Button
								variant="outlined"
								onClick={() => {
									popover.handleClose();
									modalPermisos.handleClose();
								}}
							>
								Cancelar
							</Button>
						</Grid>
					</Grid>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
}
