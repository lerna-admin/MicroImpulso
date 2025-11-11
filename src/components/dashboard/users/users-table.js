"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { activeUser, deleteCloseDay, unlockUser } from "@/app/dashboard/balance/hooks/use-balance";
import { getBranchesById } from "@/app/dashboard/configuration/branch-managment/hooks/use-branches";
import { inactiveUser } from "@/app/dashboard/users/hooks/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormHelperText,
	InputLabel,
	Link,
	ListItemIcon,
	Menu,
	MenuItem,
	Select,
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
	ExclamationMark as ExclamationMarkIcon,
	LockOpen as LockOpenIcon,
	UserCheck as UserCheckIcon,
	UserMinus as UserMinusIcon,
	XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function UsersTable({ rows, user }) {
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
			formatter: (row) => {
				const mapping = {
					blocked: {
						label: "Bloqueado",
						icon: <ExclamationMarkIcon color="var(--mui-palette-error-main)" weight="fill" />,
					},
					active: {
						label: "Activo",
						icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
					},
					inactive: {
						label: "Inactivo",
						icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" />,
					},
				};
				const { label, icon } = mapping[row.status.toLowerCase()] ?? { label: "Unknown", icon: null };

				return <Chip icon={icon} label={label} size="small" variant="outlined" />;
			},
			name: "Estado",
			width: "100px",
		},
		{
			formatter: (row) => <ActionsCell row={row} user={user} />,
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

export function ActionsCell({ row, user }) {
	const router = useRouter();
	const popover = usePopover();
	const modalRevertirCierre = usePopover();
	const modalInactivarUsuario = usePopover();
	const notificationAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [agentsOptions, setAgentsOptions] = React.useState([]);

	const schema = zod.object({
		selectedAgent: zod.string().min(1, { message: "El agente es obligatorio" }),
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			selectedAgent: "",
		},
	});

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

	const handleUnlockUser = async () => {
		try {
			await unlockUser(row.id);
			setAlertMsg("¡Se ha desbloqueado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popover.handleClose();
		notificationAlert.handleOpen();
		router.refresh();
	};

	const handleGetAgentsOptions = () => {
		getBranchesById(user.branch.id)
			.then((resp) => {
				const { agents } = resp;
				setAgentsOptions(agents);
			})
			.catch((error) => {
				setAlertMsg(error.message);
				setAlertSeverity("error");
			})
			.finally(() => {
				popover.handleClose();
				notificationAlert.handleOpen();
				modalInactivarUsuario.handleOpen();
			});
	};

	const handleActiveUser = async () => {
		try {
			await activeUser(row.id, { status: "ACTIVE" });
			setAlertMsg("¡Se ha activado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		}
		popover.handleClose();
		notificationAlert.handleOpen();
		router.refresh();
	};

	const handleInactiveUser = async (dataForm) => {
		inactiveUser(row.id, { replacementUserId: Number(dataForm.selectedAgent), currentUser: user.id })
			.then()
			.catch((error) => {
				setAlertMsg(error.message);
				setAlertSeverity("error");
			})
			.finally(() => {
				notificationAlert.handleOpen();
				modalInactivarUsuario.handleClose();
				router.refresh();
				reset();
			});
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
				<MenuItem onClick={handleUnlockUser}>
					<ListItemIcon>
						<LockOpenIcon />
					</ListItemIcon>
					<Typography>Desbloquear usuario</Typography>
				</MenuItem>
				<MenuItem onClick={handleActiveUser}>
					<ListItemIcon>
						<UserCheckIcon />
					</ListItemIcon>
					<Typography>Activar usuario</Typography>
				</MenuItem>
				<MenuItem onClick={handleGetAgentsOptions}>
					<ListItemIcon>
						<UserMinusIcon />
					</ListItemIcon>
					<Typography>Inactivar usuario</Typography>
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

			{/* Modal para inactivar usuario */}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={modalInactivarUsuario.open}
				onClose={modalInactivarUsuario.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4, pb: 4 }}>
					{"Inactivar usuario"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"justify"} sx={{ pb: 3 }}>
						{`¿Desea inactivar el usuario ${row.name}?. Debes seleccionar un agente para asignarle los clientes.`}
					</DialogContentText>
					<form onSubmit={handleSubmit(handleInactiveUser)}>
						<Stack spacing={3}>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 12,
										xs: 12,
									}}
								>
									<Controller
										control={control}
										name="selectedAgent"
										render={({ field }) => (
											<FormControl fullWidth error={Boolean(errors.selectedAgent)}>
												<InputLabel>{"Agentes"}</InputLabel>
												<Select {...field}>
													{agentsOptions.map((option) => (
														<MenuItem key={option.id} value={option.id.toString()}>
															{option.name}
														</MenuItem>
													))}
												</Select>
												{errors.selectedAgent ? <FormHelperText>{errors.selectedAgent.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
							<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2}>
								<Button variant="contained" type="submit" autoFocus>
									Aceptar
								</Button>
								<Button
									variant="outlined"
									onClick={() => {
										popover.handleClose();
										modalInactivarUsuario.handleClose();
										reset();
									}}
								>
									Cancelar
								</Button>
							</Box>
						</Stack>
					</form>
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
