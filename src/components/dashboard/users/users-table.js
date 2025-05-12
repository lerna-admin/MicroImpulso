"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CardsThree as CardsThreeIcon, DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";

import { paths } from "@/paths";
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

		// {
		// 	formatter: (row) => <ActionsCell row={row} />,
		// 	name: "Acciones",
		// 	hideName: true,
		// 	width: "70px",
		// 	align: "right",
		// },
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
	const router = useRouter();
	const popover = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handleEditProfile = () => {
		popover.handleClose();
		router.push(paths.dashboard.users);
	};

	const handleLoanRequests = () => {
		popover.handleClose();
		router.push(`${paths.dashboard.requests.list}?document=${row.document}`);
	};

	return (
		<>
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
				<MenuItem onClick={handleEditProfile}>
					<ListItemIcon>
						<PencilSimpleIcon />
					</ListItemIcon>
					<Typography>Editar perfil</Typography>
				</MenuItem>
				<MenuItem onClick={handleLoanRequests}>
					<ListItemIcon>
						<CardsThreeIcon />
					</ListItemIcon>
					<Typography>Ver solicitudes</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
