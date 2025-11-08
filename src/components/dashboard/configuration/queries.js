"use client";

import * as React from "react";
import { getAllCustomersByQuery, getCustomerById } from "@/app/dashboard/customers/hooks/use-customers";
import { getAllRequestsByCustomerId } from "@/app/dashboard/requests/hooks/use-requests";
import { ROLES } from "@/constants/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Autocomplete,
	Avatar,
	Box,
	Card,
	CardContent,
	CardHeader,
	Chip,
	CircularProgress,
	Divider,
	FormControl,
	FormHelperText,
	InputLabel,
	Stack,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { PropertyList } from "@/components/core/property-list";

import { CustomerEditForm } from "../customer/customer-edit-form";
import { CustomersLineItemsTable } from "../customer/customers-line-items-table";

export function Queries({ role }) {
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const [customer, setCustomer] = React.useState(null);
	const [allRequestByCustomer, setAllRequestByCustomer] = React.useState([]);

	const totalRequestsAmountToPay = allRequestByCustomer.reduce((acc, req) => acc + req.amount, 0);

	const schema = zod.object({
		customer: zod
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
		customer: { id: null, label: null },
	};

	const {
		control,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const fetchOptions = async (query) => {
		setLoading(true);
		try {
			const { items } = await getAllCustomersByQuery(query);

			const dataFormatted = items.map((client) => ({
				id: client.id,
				label: `${client.name} - ${client.phone} - ${client.email} - ${client.document}`,
			}));
			setOptions(dataFormatted);
		} catch (error) {
			console.error("Error fetching autocomplete options:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSetData = async (customerSelected) => {
		if (!customerSelected) return;
		const customer = await getCustomerById(customerSelected.id);
		const allRequests = await getAllRequestsByCustomerId(customerSelected.id);
		console.log(customer);
		console.log(allRequests);
		
		setCustomer(customer);
		setAllRequestByCustomer(allRequests);
	};

	const resetData = () => {
		setCustomer(null);
		setAllRequestByCustomer([]);
	};

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

	return (
		<>
			<Grid container spacing={4} sx={{ justifyContent: "center", alignItems: "center", padding: 4 }}>
				<Controller
					control={control}
					name="customer"
					render={({ field }) => {
						return (
							<FormControl error={Boolean(errors.customer)} fullWidth>
								<InputLabel sx={{ marginBottom: "0.5rem" }}>Buscar cliente por:</InputLabel>
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
										handleSetData(newValue);
										field.onChange(newValue ?? { id: null, label: null });
										resetData();
									}}
									getOptionLabel={(option) => (typeof option === "string" ? option : option?.label || "")}
									isOptionEqualToValue={(option, value) => option?.label === value?.label}
									renderInput={(params) => (
										<TextField
											{...params}
											placeholder="Nombre, celular, correo o documento"
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
								{errors.customer ? <FormHelperText>{errors.customer.message}</FormHelperText> : null}
							</FormControl>
						);
					}}
				/>
				<Grid
					size={{
						lg: 12,
						xs: 12,
					}}
				>
					<Stack spacing={4}>
						{customer === null ? null : (
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title={
										<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
											<Box sx={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
												<Typography variant="body1" color="initial">
													Perfil
												</Typography>
												{customer.client.lead && (
													<Chip
														sx={{ backgroundColor: "#04aad6a3" }}
														label={"Importado"}
														size="small"
														variant="contained"
													/>
												)}
											</Box>

											{customer.client.status.toLowerCase() === "inactive" ? (
												<Chip color="error" label={"Inactivo"} size="small" variant="contained" />
											) : (
												<Chip color="success" label={"Activo"} size="small" variant="contained" />
											)}
										</Box>
									}
								/>
								<PropertyList
									divider={<Divider />}
									orientation="vertical"
									sx={{ "--PropertyItem-padding": "12px 24px" }}
								>
									<CustomerEditForm customerToEdit={customer} onlyRead={true} />
								</PropertyList>
							</Card>
						)}

						{customer === null ? null : (
							<Card>
								<CardHeader
									avatar={
										<Avatar>
											<UserIcon fontSize="var(--Icon-fontSize)" />
										</Avatar>
									}
									title="Solicitudes del Cliente"
								/>
								<CardContent>
									<Card sx={{ borderRadius: 1 }} variant="outlined">
										<Box sx={{ overflowX: "auto" }}>
											<CustomersLineItemsTable rows={allRequestByCustomer} />
										</Box>
										<Divider />
										<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
											<Stack spacing={2} sx={{ width: "300px", maxWidth: "100%" }}>
												<Stack direction="row" sx={{ justifyContent: "space-between" }}>
													<Typography variant="subtitle1">Total</Typography>
													<Typography variant="subtitle1">
														{new Intl.NumberFormat("es-CO", {
															style: "currency",
															currency: "COP",
															minimumFractionDigits: 0,
														}).format(totalRequestsAmountToPay)}
													</Typography>
												</Stack>
											</Stack>
										</Box>
									</Card>
								</CardContent>
							</Card>
						)}
					</Stack>
				</Grid>
			</Grid>
		</>
	);
}
