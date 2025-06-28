"use client";

import * as React from "react";
import RouterLink from "next/link";
import { deleteCloseDay } from "@/app/dashboard/balance/hooks/use-balance";
import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Link,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	ArrowCounterClockwise as ArrowCounterClockwiseIcon,
	DotsThree as DotsThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function UsersTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Link
							color="inherit"
							component={RouterLink}
							variant="subtitle2"
							href={paths.dashboard.users.details(row.id)}
							sx={{ whiteSpace: "nowrap" }}
						>
							{row.name}
						</Link>

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
	const modalRevertirCierre = usePopover();
	const notificationAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleRevertClosingDay = async () => {
		try {
			await deleteCloseDay(row.id);
			setAlertMsg("¡Se ha revertido exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		notificationAlert.handleOpen();
		modalRevertirCierre.handleClose();
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
				<MenuItem onClick={modalRevertirCierre.handleOpen}>
					<ListItemIcon>
						<ArrowCounterClockwiseIcon />
					</ListItemIcon>
					<Typography>Revertir cierre del dia</Typography>
				</MenuItem>
			</Menu>

			{/* Modal para revertir cierre del dia */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalRevertirCierre.open}
				onClose={modalRevertirCierre.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4, pb: 4 }}>
					{"Revertir cierre del dia"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"} sx={{ pb: 3 }}>
						{`¿Desea revertir el cierre del dia para ${row.name} ?`}
					</DialogContentText>
					<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2}>
						<Button variant="contained" onClick={handleRevertClosingDay} autoFocus>
							Aceptar
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								popover.handleClose();
								modalRevertirCierre.handleClose();
							}}
						>
							Cancelar
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			<NotificationAlert
				openAlert={notificationAlert.open}
				onClose={notificationAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</React.Fragment>
	);
}
