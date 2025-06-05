"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { formatPhoneNumber } from "@/helpers/phone-mask";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BellRinging as BellRingingIcon, DotsThree as DotsThreeIcon } from "@phosphor-icons/react/dist/ssr";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";

dayjs.locale("es");

const getColorByDaysLeft = (daysLeft) => {
	if (daysLeft <= 3) return "#FF0000"; // Rojo;
	if (daysLeft <= 8) return "#FF7F50"; // Naranja;
	if (daysLeft <= 12) return "#FFD700"; // Amarillo
};

export function CustomersTable({ rows }) {
	const columns = [
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="text.secondary" variant="body2">
						{row.client.id}
					</Typography>
					<ShowAlert endDateLoanRequest={row.loanRequest.endDateAt} />
				</Stack>
			),
			name: "#",
			align: "center",
			width: "50px",
		},
		{
			formatter: (row) => (
				<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
					<div>
						<Link
							color="inherit"
							component={RouterLink}
							href={paths.dashboard.customers.details(row.client.id)}
							sx={{ whiteSpace: "nowrap" }}
							variant="subtitle2"
						>
							{row.client.name}
						</Link>
						<Typography color="text.secondary" variant="body2">
							{formatPhoneNumber(row.client.phone)}
						</Typography>
						<Typography color="text.secondary" variant="body2">
							{row.client.document}
						</Typography>
					</div>
				</Stack>
			),
			name: "Nombre Completo",
			width: "150px",
		},
		{
			formatter: (row) => (
				<Stack direction="column" spacing={1} sx={{ alignItems: "center" }}>
					<Typography color="inherit" variant="body2">
						{dayjs(row.loanRequest.createdAt).format("MMM D, YYYY")}
					</Typography>
					<Typography color="inherit" variant="body2">
						{dayjs(row.loanRequest.endDateAt).format("MMM D, YYYY")}
					</Typography>
				</Stack>
			),
			name: "Fecha inicio / Fecha de pago",
			align: "center",
			width: "120px",
		},

		{
			formatter(row) {
				return dayjs(row.loanRequest.updatedAt).format("MMM D, YYYY");
			},
			name: "Fecha Ult. Pago",
			align: "center",
			width: "135px",
		},
		{
			formatter(row) {
				return row.loanRequest.type?.toUpperCase();
			},
			name: "Tipo Pago",
			align: "center",
			width: "80px",
		},
		{
			formatter(row) {
				return row.loanRequest.mode;
			},
			name: "Modalidad",
			align: "center",
			width: "100px",
		},
		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.amountBorrowed
				);
			},
			name: "Prestamo",
			align: "center",
			width: "90px",
		},
		{
			formatter(row) {
				return row.loanRequest.paymentDay;
			},
			name: "Dia Pago",
			align: "center",
			width: "70px",
		},
		{ field: "diasMora", name: "Mora", align: "center", width: "60px" },
		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.totalRepayment
				);
			},
			name: "Abono",
			align: "center",
			width: "90px",
		},

		{
			formatter(row) {
				return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
					row.loanRequest.amount - row.totalRepayment
				);
			},
			name: "Saldo",
			align: "center",
			width: "90px",
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
						No se encontraron clientes
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}

function ShowAlert({ endDateLoanRequest }) {
	const today = dayjs().startOf("day");
	const endDate = dayjs(endDateLoanRequest).utc().startOf("day");
	const daysLeft = endDate.diff(today, "day") + 1;
	const [color, setColor] = React.useState("");

	React.useEffect(() => {
		const color = getColorByDaysLeft(daysLeft);
		setColor(color);
	}, [daysLeft]);

	return daysLeft < 13 ? <BellRingingIcon size={18} weight="fill" color={color} /> : null;
}

function ActionsCell({ row }) {
	const router = useRouter();
	const popover = usePopover();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleOptions = (event) => {
		setAnchorEl(event.currentTarget);
		popover.handleOpen();
	};

	const handlePayment = () => {
		popover.handleClose();
		router.push(paths.dashboard.requests.details(row.loanRequest.id));
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
				<MenuItem onClick={handlePayment}>
					<Typography>Abonar</Typography>
				</MenuItem>
			</Menu>
		</>
	);
}
