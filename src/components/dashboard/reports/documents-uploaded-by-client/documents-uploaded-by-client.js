"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllCustomers, getCustomerById } from "@/app/dashboard/customers/hooks/use-customers";
import { getDocumentsUploadedByClient } from "@/app/dashboard/reports/services/reports";
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
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { usePopover } from "@/hooks/use-popover";
import { DataTable } from "@/components/core/data-table";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

const columns = [
	{ field: "label", name: "Nombre de documento", width: "50px" },
	{
		formatter(row) {
			return dayjs(row.uploadedAt).format("MMM D, YYYY");
		},
		name: "Fecha de subida",
		width: "150px",
	},
	{
		formatter(row) {
			return (
				<Link target="_blank" href={paths.dashboard.documents.details(row.docId)} variant="subtitle2">
					File
				</Link>
			);
		},
		name: "URL",
		width: "150px",
	},
	{
		formatter(row) {
			const mapping = {
				ID: { label: "Cedula" },
				WORK_LETTER: { label: "Carta laboral" },
				UTILITY_BILL: { label: "Recibo" },
				PAYMENT_DETAIL: { label: "Desprendible de pago" },
				OTHER: { label: "Otro" },
			};

			const { label } = mapping[row.type] ?? { label: "Unknown" };

			return <Chip label={label} size="medium" variant="outlined" />;
		},
		name: "Clasificación",
		width: "150px",
	},
];

export function DocumentsUploadedByClient({ filters, user }) {
	const { startDate, endDate, clientId } = filters;

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
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("");

	const router = useRouter();
	const [rows, setRows] = React.useState([]);
	const [boxes, setBoxes] = React.useState([]);

	const [selectedStartDate, setSelectedStartDate] = React.useState(dayjs(startDate));
	const [selectedEndDate, setSelectedEndDate] = React.useState(dayjs(endDate));
	const [selectedClient, setSelectedClient] = React.useState(null);

	const updateSearchParams = React.useCallback(
		(newFilters) => {
			const searchParams = new URLSearchParams();

			if (newFilters.startDate) {
				searchParams.set("startDate", newFilters.startDate);
			}
			if (newFilters.endDate) {
				searchParams.set("endDate", newFilters.endDate);
			}
			if (newFilters.docType) {
				searchParams.set("docType", newFilters.docType);
			}
			if (newFilters.clientId) {
				searchParams.set("clientId", newFilters.clientId);
			}

			router.push(`${paths.dashboard.reports.documentsUploadedByClient}?${searchParams.toString()}`);
		},
		[router]
	);

	const handleFilterStartDateChange = React.useCallback(
		(value) => {
			setSelectedStartDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, startDate: dateFormatted });
		},
		[updateSearchParams, filters]
	);

	const handleFilterEndDateChange = React.useCallback(
		(value) => {
			setSelectedEndDate(value);
			const dateFormatted = dayjs(value).format("YYYY-MM-DD");
			updateSearchParams({ ...filters, endDate: dateFormatted });
		},
		[updateSearchParams, filters, clientId]
	);

	const getDocumentsUploaded = async (clientId) => {
		if (!clientId) return;
		setLoading(true);

		try {
			const { totals, blocks } = await getDocumentsUploadedByClient({
				userId: user.id,
				startDate: dayjs(selectedStartDate).format("YYYY-MM-DD"),
				endDate: dayjs(selectedEndDate).format("YYYY-MM-DD"),
				clientId,
			});
			setBoxes(formattedBoxes(totals, ["Total documentos por cliente"]));
			if (blocks.length > 0) setRows(blocks[0]?.documents);
		} catch (error) {
			setAlertMsg(error);
			setAlertSeverity("error");
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		if (!filters.clientId) return;
		if (filters) {
			getDocumentsUploaded(clientId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	React.useEffect(() => {
		if (!filters.clientId) return;

		const loadClient = async () => {
			try {
				setLoading(true);
				const { client } = await getCustomerById(filters.clientId); // Asume que tu API puede buscar por ID
				if (client) {
					const clientData = { label: client.name, id: client.id };
					setSelectedClient(clientData);
					// Opcional: añadir a las opciones si no está
					setOptions((prev) => {
						const exists = prev.find((o) => o.id === clientData.id);
						return exists ? prev : [...prev, clientData];
					});
				}
			} catch (error) {
				setAlertMsg(error);
				setAlertSeverity("error");
			} finally {
				setLoading(false);
			}
		};

		loadClient();
	}, [filters.clientId]);

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
			const { data } = await getAllCustomers({ name: query });
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

	return (
		<Stack spacing={4}>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Typography variant="h4" flexGrow={1} textAlign={{ xs: "center", sm: "left" }}>
					Documentos Subidos por Cliente
				</Typography>

				<DatePicker
					label="Fecha inicio:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="startDate"
					value={selectedStartDate}
					onChange={handleFilterStartDateChange}
				/>

				<DatePicker
					label="Fecha final:"
					sx={{ flexGrow: 1, maxWidth: "170px" }}
					name="endDate"
					value={selectedEndDate}
					onChange={handleFilterEndDateChange}
				/>
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
								value={selectedClient || null}
								onInputChange={(event, newInputValue) => {
									setInputValue(newInputValue);
								}}
								onChange={(event, newValue) => {
									setSelectedClient(newValue ?? null);
									field.onChange(newValue ?? { id: null, label: null });
									updateSearchParams({ ...filters, clientId: newValue?.id });
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
			{boxes.length === 0 ? null : (
				<Card>
					<Box
						sx={{
							display: "grid",
							columnGap: 0,
							gap: 2,
							gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(1, 1fr)" },
							p: 3,
						}}
					>
						{boxes.map((item, index) => {
							const isLastInRow = (index + 1) % columns === 0;

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
									<Typography variant="h3">{item.value}</Typography>
								</Stack>
							);
						})}
					</Box>
				</Card>
			)}

			{rows.length === 0 ? null : (
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

function formattedBoxes(data, boxesNames) {
	return Object.entries(data).map(([_, value], index) => {
		return {
			name: boxesNames[index],
			value: value,
		};
	});
}
