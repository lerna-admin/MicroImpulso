"use client";

import * as React from "react";
import { getAllCustomers } from "@/app/dashboard/customers/hooks/use-customers";
import { getLoanHistoryByClient } from "@/app/dashboard/reports/services/reports";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	Box,
	Card,
	Chip,
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	Stack,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { ExclamationMark as ExclamationMarkIcon, XCircle as XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { CheckCircle as CheckCircleIcon } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

import { ExportComponent } from "../../export/export-component";

const columns = [
	{ field: "loanId", name: "ID", width: "50px" },
	{
		formatter(row) {
			return dayjs(row.startDate).format("MMM D, YYYY");
		},
		name: "Fecha inicio",
		width: "150px",
	},
	{
		formatter(row) {
			return dayjs(row.endDate).format("MMM D, YYYY");
		},
		name: "Fecha final",
		width: "150px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.loanAmount
			);
		},
		name: "Monto",
		width: "100px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.totalRepaid
			);
		},
		name: "Total pagado",
		width: "100px",
	},
	{
		formatter: (row) => {
			return new Intl.NumberFormat("en-US", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
				row.outstanding
			);
		},
		name: "Total pendiente",
		width: "100px",
	},
	{
		formatter: (row) => {
			const mapping = {
				new: {
					label: "Nueva",
					icon: <ExclamationMarkIcon color="var(--mui-palette-info-main)" weight="fill" />,
				},
				under_review: {
					label: "En estudio",
					icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" />,
				},
				approved: {
					label: "Aprobada",
					icon: <CheckCircleIcon color="var(--mui-palette-info-main)" weight="fill" />,
				},
				funded: {
					label: "Desembolsado",
					icon: <CheckCircleIcon color="var(--mui-palette-warning-main)" weight="fill" />,
				},
				completed: {
					label: "Completada",
					icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
				},
				rejected: { label: "Rechazada", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
				canceled: { label: "Cancelada", icon: <XCircleIcon color="var(--mui-palette-error-main)" weight="fill" /> },
			};
			const { label, icon } = mapping[row.status] ?? { label: "Unknown", icon: null };

			return <Chip icon={icon} label={label} size="small" variant="outlined" />;
		},
		name: "Estado",
		width: "100px",
	},
];

export function LoanHistoryByClient({ user }) {
	const schema = zod.object({
		user: zod
			.object({
				id: zod.number().nullable(),
				label: zod.string().nullable(),
			})
			.refine(
				(val) =>
					typeof val === "object" &&
					val !== null &&
					"id" in val &&
					typeof val.id === "number" &&
					val.id > 0 &&
					"label" in val &&
					typeof val.label === "string" &&
					val.label.trim() !== "",
				{
					message: "Debes seleccionar un cliente",
				}
			),
	});

	const defaultValues = {
		client: { id: null, label: null },
	};

	const {
		control,
		getValues,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const [rows, setRows] = React.useState([]);

	const [detailToExport, setDetailToExport] = React.useState([]);
	const [totalToExport, setTotalToExport] = React.useState([]);

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");

	const theme = useTheme();
	const isLg = useMediaQuery(theme.breakpoints.up("lg"));
	const isMd = useMediaQuery(theme.breakpoints.up("md"));
	const boxesNames = ["Total solicitudes", "Total prestado", "Total pagado"];
	const [boxes, setBoxes] = React.useState([]);

	const columnsBoxes = isLg ? 3 : isMd ? 2 : 1;

	const debounced = React.useMemo(
		() =>
			debounce((value) => {
				if (value.trim()) {
					fetchOptions(value);
				} else {
					setOptions([]);
				}
			}, 700), // Espera 700ms después del último tipo
		[]
	);

	React.useEffect(() => {
		debounced(inputValue);
		// Cleanup del debounce para evitar efectos secundarios
		return () => {
			debounced.clear();
		};
	}, [inputValue, debounced]);

	const fetchOptions = async (query) => {
		setLoading(true);
		try {
			const { data } = await getAllCustomers({ name: query, u_id: user.id });
			const dataFormatted = data.map(({ client }) => ({ label: client.name, id: client.id }));
			setOptions(dataFormatted);
		} catch (error) {
			setAlertMsg(error);
			setAlertSeverity("error");
		} finally {
			setLoading(false);
		}
	};

	const resetData = () => {
		setBoxes([]);
		setRows([]);
	};

	const getClientLoanHistory = async (clientId) => {
		if (!clientId) return;
		setLoading(true);
		try {
			const { totals, loans } = await getLoanHistoryByClient({ userId: user.id, clientId });

			const statusMap = {
				approved: "Aprobado",
				funded: "Desembolsado",
				new: "Nuevo",
				completed: "Completado",
			};

			const detailRowsToExport = loans.map((loan) => ({
				"ID Solicitud": loan.loanId,
				Monto: loan.loanAmount,
				Estado: statusMap[loan.status] || loan.status,
				"Fecha Inicio": loan.startDate,
				"Fecha Final": loan.endDate,
				"Total Pagado": loan.totalRepaid,
				"Total Pendiente": loan.outstanding,
			}));

			setRows(loans);
			setDetailToExport(detailRowsToExport);

			const boxes = Object.entries(totals).map(([_, value], index) => {
				return {
					name: boxesNames[index],
					value: value,
				};
			});

			boxes.pop(); // Se elimina el ultimo ya que no se va a usar

			const totalsRowToExport = boxes.reduce((acc, item) => {
				acc[item.name] = item.value;
				return acc;
			}, {});

			setBoxes(boxes);
			setTotalToExport(totalsRowToExport);
		} catch (error) {
			setAlertMsg(error);
			setAlertSeverity("error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Histórico de Préstamos por Cliente</Typography>
				</Box>
			</Stack>
			<Controller
				control={control}
				name="client"
				render={({ field }) => {
					return (
						<FormControl error={Boolean(errors.client)}>
							<InputLabel required sx={{ marginBottom: "0.5rem" }}>
								Cliente
							</InputLabel>
							<Autocomplete
								freeSolo
								options={options}
								loading={loading}
								inputValue={inputValue}
								value={field.value || null}
								onInputChange={(event, newInputValue) => {
									setInputValue(newInputValue);
								}}
								onChange={(event, newValue) => {
									getClientLoanHistory(newValue?.id);
									field.onChange(newValue ?? { id: null, label: null });
									resetData();
								}}
								getOptionLabel={(option) => (typeof option === "string" ? option : option?.label || "")}
								isOptionEqualToValue={(option, value) => option?.label === value?.label}
								renderInput={(params) => (
									<TextField
										{...params}
										placeholder="Escribe su nombre"
										variant="outlined"
										slotProps={{
											input: {
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{loading ? <CircularProgress color="inherit" size={20} /> : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											},
										}}
									/>
								)}
							/>
							{errors.client ? <FormHelperText>{errors.client.message}</FormHelperText> : null}
						</FormControl>
					);
				}}
			/>

			{rows.length === 0 ? null : boxes.length === 0 ? null : (
				<Stack spacing={3} direction={"column"} justifyContent={"end"}>
					<ExportComponent
						reports={{
							reportName: `Histórico de Préstamos por Cliente ${getValues("client").label}`,
							detailRowsToExport: detailToExport,
							totalsRowToExport: totalToExport,
						}}
					/>

					<Card>
						<Box
							sx={{
								display: "grid",
								columnGap: 0,
								gap: 2,
								gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
								p: 3,
							}}
						>
							{boxes.map((item, index) => {
								const isLastInRow = (index + 1) % columnsBoxes === 0;

								return (
									<Stack
										key={item.name}
										spacing={1}
										sx={{
											borderRight: isLastInRow ? "none" : "1px solid var(--mui-palette-divider)",
											borderBottom: { xs: "1px solid var(--mui-palette-divider)", md: "none" },
											pb: { xs: 2, md: 0 },
										}}
									>
										<Typography color="text.secondary">{item.name}</Typography>
										<Typography variant="h3">
											{item.name === boxesNames.at(0)
												? item.value
												: new Intl.NumberFormat("es-CO", {
														style: "currency",
														currency: "COP",
														minimumFractionDigits: 0,
													}).format(item.value)}
										</Typography>
									</Stack>
								);
							})}
						</Box>
					</Card>
				</Stack>
			)}

			{rows.length === 0 ? (
				<Typography variant="body1" color="grey" textAlign={"center"}>
					No hay resultados.
				</Typography>
			) : (
				<Card>
					<Box sx={{ overflowX: "auto" }}>
						<DataTable columns={columns} rows={rows} />
					</Box>
				</Card>
			)}

			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</Stack>
	);
}
