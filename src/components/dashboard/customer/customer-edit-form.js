"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function CustomerEditForm({ customerToEdit }) {
	const [formData, setFormData] = React.useState({
		document: "",
		name: "",
		phone: "",
		email: "",
		address: "",
		totalLoanAmount: "",
		createdAt: "",
		updatedAt: "",
	});

	const [openAlert, setOpenAlert] = React.useState(false);

	const router = useRouter();

	React.useEffect(() => {
		if (customerToEdit) {
			setFormData(customerToEdit);
		}
	}, [customerToEdit]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await updateCustomer(formData);
		if (response.status == 200) setOpenAlert(true);
		setTimeout(() => {
			router.push(paths.dashboard.customers.list);
		}, 1500);
	};

	return (
		<>
			<form>
				<Stack spacing={2} sx={{ p: 3 }}>
					<Grid container spacing={3}>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Cedula</InputLabel>
								<OutlinedInput
									defaultValue={customerToEdit.document}
									id="document"
									name="document"
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Nombre Completo</InputLabel>
								<OutlinedInput
									defaultValue={customerToEdit.name}
									id="name"
									name="name"
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Celular</InputLabel>
								<OutlinedInput
									defaultValue={customerToEdit.phone}
									id="phone"
									name="phone"
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Correo</InputLabel>
								<OutlinedInput
									defaultValue={customerToEdit.email}
									name="email"
									id="email"
									type="email"
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>

						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Dirección</InputLabel>
								<OutlinedInput
									defaultValue={customerToEdit.address}
									id="address"
									name="address"
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								<InputLabel>Monto Prestado</InputLabel>
								<OutlinedInput
									disabled
									id="totalLoanAmount"
									name="totalLoanAmount"
									defaultValue={`$ ${customerToEdit.totalLoanAmount}`}
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								{/* <OutlinedInput defaultValue="" name="starDate" type="date" /> */}
								<DatePicker
									disabled
									name="startDate"
									format="MMM D, YYYY hh:mm A"
									label="Fecha Inicio"
									value={dayjs(customerToEdit.createdAt)}
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<FormControl fullWidth>
								{/* <OutlinedInput defaultValue="" name="endDate" type="date" /> */}
								<DatePicker
									disabled
									name="endDate"
									format="MMM D, YYYY hh:mm A"
									label="Fecha Fin"
									value={dayjs(customerToEdit.updatedAt)}
									onChange={handleChange}
								/>
							</FormControl>
						</Grid>
					</Grid>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
						<Button color="secondary" variant="outlined" onClick={() => router.push(paths.dashboard.customers.list)}>
							Cancelar
						</Button>
						<Button variant="contained" onClick={handleSubmit}>
							Confirmar
						</Button>
					</Stack>
				</Stack>
			</form>

			<NotificationAlert
				openAlert={openAlert}
				onClose={() => setOpenAlert(false)}
				msg={"Perfil actualizado!"}
				autoHideDuration={3000}
				posHorizontal={"right"}
				posVertical={"bottom"}
			></NotificationAlert>
		</>
	);
}
