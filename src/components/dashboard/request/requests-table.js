"use client";

import * as React from "react";
import RouterLink from "next/link";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr/XCircle";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { DataTable } from "@/components/core/data-table";


const columns = [
	{
		formatter: (row) => (
			<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
				<Box
					sx={{
						bgcolor: "var(--mui-palette-background-level1)",
						borderRadius: 1.5,
						flex: "0 0 auto",
						p: "4px 8px",
						textAlign: "center",
					}}
				>
					<Typography variant="caption">{dayjs(row.createdAt).format("MMM").toUpperCase()}</Typography>
					<Typography variant="h6">{dayjs(row.createdAt).format("D")}</Typography>
				</Box>
				<div>
					<Link
						color="text.primary"
						component={RouterLink}
						href={paths.dashboard.requests.preview("1")}
						sx={{ cursor: "pointer" }}
						variant="subtitle2"
					>
						{row.id}
					</Link>
				</div>
			</Stack>
		),
		name: "Solicitud",
		width: "250px",
	},

	{ field: "frequency", name: "Frecuencia de pago", width: "150px" },
	{
		formatter: (row) => (
			<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
				<Avatar src={row.customer.avatar} />
				<div>
					<Typography variant="subtitle2">{row.customer.name}</Typography>
					<Typography color="text.secondary" variant="body2">
						{row.customer.email}
					</Typography>
				</div>
			</Stack>
		),
		name: "Cliente",
		width: "250px",
	},
	{
		formatter: (row) => {
			const mapping = {
				pending: { label: "Pendiente", icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
				approved: {
					label: "Aprobado",
					icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
				},
				rejected: { label: "Rechazado", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
			};
			const { label, icon } = mapping[row.status] ?? { label: "Unknown", icon: null };

			return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		},
		name: "Estado",
		width: "100px",
	},
	{
		formatter: () => (
			<IconButton component={RouterLink} href={paths.dashboard.requests.preview("1")}>
				<EyeIcon />
			</IconButton>
		),
		name: "Actions",
		hideName: true,
		width: "100px",
		align: "right",
	},
];

export function RequestsTable({ rows }) {
	return (
		<React.Fragment>
			<DataTable columns={columns} rows={rows} />
			{rows.length === 0 ? (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No requests found
					</Typography>
				</Box>
			) : null}
		</React.Fragment>
	);
}
