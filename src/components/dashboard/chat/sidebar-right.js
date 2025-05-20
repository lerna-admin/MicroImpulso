"use client";

import * as React from "react";
// import { updateCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormHelperText, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Option } from "@/components/core/option";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

import { ChatContext } from "./chat-context";
import { LoanSimulation } from "./loan-simulation";

const schema = zod.object({
	email: zod.string().min(1, { message: "Correo es obligatorio" }).email(),
});

export function SidebarRight({
	contacts,
	currentThreadId,
	messages,
	onCloseMobile,
	onSelectContact,
	onSelectThread,
	openDesktop,
	openMobile,
	threads,
}) {
	const mdUp = useMediaQuery("up", "md");

	const content = (
		<SidebarContent
			closeOnGroupClick={!mdUp}
			closeOnThreadSelect={!mdUp}
			contacts={contacts}
			currentThreadId={currentThreadId}
			messages={messages}
			onClose={onCloseMobile}
			onSelectContact={onSelectContact}
			onSelectThread={onSelectThread}
			threads={threads}
		/>
	);

	if (mdUp) {
		return (
			<Box
				sx={{
					borderLeft: "1px solid var(--mui-palette-divider)",
					flex: "0 0 auto",
					mr: openDesktop ? 0 : "-500px",
					position: "relative",
					transition: "margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
					width: "500px",
				}}
			>
				{content}
			</Box>
		);
	}

	return (
		<Drawer PaperProps={{ sx: { maxWidth: "100%", width: "500px" } }} onClose={onCloseMobile} open={openMobile}>
			{content}
		</Drawer>
	);
}

function SidebarContent({ currentThreadId, threads, contacts }) {
	const { setOpenDesktopSidebarRight } = React.useContext(ChatContext);

	const {
		control,
		handleSubmit,
		// setError,
		formState: { errors },
	} = useForm({ resolver: zodResolver(schema) });

	const [formData, setFormData] = React.useState({
		id: "",
		name: "",
		phone: "",
		email: "",
		document: "",
		address: "",
		totalLoanAmount: "",
		status: "",
		createdAt: "",
		updatedAt: "",
	});

	const [threadFound, setThreadFound] = React.useState({
		id: "",
		type: "",
		participants: [],
	});

	const [contactFound, setContactFound] = React.useState({
		id: null,
		name: "",
		phone: "",
		email: null,
		document: null,
		address: null,
		totalLoanAmount: null,
		status: "",
		createdAt: "",
		updatedAt: "",
	});

	const [openAlert, setOpenAlert] = React.useState(false);
	const [isPending, setIsPending] = React.useState(false);

	// Cuando cambia currentThreadId, busca el thread
	React.useEffect(() => {
		if (currentThreadId) {
			const foundThread = threads.find((thread) => thread.id === currentThreadId);
			if (foundThread) {
				setThreadFound(foundThread);
			}
		}
	}, [currentThreadId, threads]);

	// Cuando cambia threadFound, busca el contacto
	React.useEffect(() => {
		if (threadFound && threadFound.participants?.[1]) {
			const contact = contacts.find((c) => c.id === threadFound.participants[1].id);
			if (contact) {
				setContactFound(contact);
			}
		}
	}, [threadFound, contacts]);

	// Cuando cambia contactFound, actualiza formData
	React.useEffect(() => {
		if (contactFound?.id) {
			setFormData(contactFound);
		}
	}, [contactFound]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	const response = await updateCustomer(formData);
	// 	if (response.status == 200) setOpenAlert(true);
	// };
	const onSubmit = React.useCallback(
		async (values) => {
			console.log(values);

			setIsPending(true);
			// const { data, error } = await signInWithPassword(values);
			// if (error) {
			// 	setError("root", { type: "server", message: error });
			// 	setIsPending(false);
			// 	return;
			// }
			// // Update the user in the auth context so client components that depend on it can re-render.
			// auth.setUser(data.user);
			// // On router refresh the sign-in page component will automatically redirect to the dashboard.
			// router.refresh();
		},
		[
			// auth, router, setError
		]
	);

	return (
		<React.Fragment>
			<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "0 0 auto", p: 2 }}>
					<Typography sx={{ flex: "1 1 auto" }} variant="h5">
						Perfil
					</Typography>
					<IconButton
						onClick={() => {
							setOpenDesktopSidebarRight((prev) => !prev);
						}}
					>
						<XIcon />
					</IconButton>
				</Stack>

				<form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%", overflowY: "auto" }}>
					<Stack spacing={4} sx={{ p: 3 }}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<FormControl fullWidth>
									<InputLabel>Nombre Completo</InputLabel>
									<OutlinedInput defaultValue={formData.name} id="name" name="name" onChange={handleChange} />
								</FormControl>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<FormControl fullWidth>
									<InputLabel>Tipo de Documento</InputLabel>
									<Select displayEmpty={true} id="documentType" name="documentType" onChange={handleChange}>
										<Option value="cc">Cedula de Ciudadania</Option>
										<Option value="ce">Cedula de Extranjeria</Option>
										<Option value="te">Tarjeta de extranjería</Option>
									</Select>
								</FormControl>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<FormControl fullWidth>
									<InputLabel>Cedula</InputLabel>
									<OutlinedInput
										defaultValue={formData.document}
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
									<InputLabel>Dirección</InputLabel>
									<OutlinedInput defaultValue={formData.address} id="adress" name="address" onChange={handleChange} />
								</FormControl>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="email"
									render={({ field }) => (
										<FormControl error={Boolean(errors.email)}>
											<InputLabel>Correo</InputLabel>
											<OutlinedInput {...field} type="email" />
											{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
								{/* <FormControl fullWidth>
								<InputLabel>Correo</InputLabel>
								<OutlinedInput defaultValue={formData.email} id="email" name="email" onChange={handleChange} />
							</FormControl> */}
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<FormControl fullWidth>
									<InputLabel>Numero Celular</InputLabel>
									<OutlinedInput defaultValue={formData.phone} id="phone" name="phone" onChange={handleChange} />
								</FormControl>
							</Grid>
						</Grid>

						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<Button disabled={!isPending} variant="contained" type="submit">
								Guardar
							</Button>
						</Grid>

						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<LoanSimulation />
						</Grid>
					</Stack>
				</form>
			</Box>

			<NotificationAlert
				openAlert={openAlert}
				onClose={() => setOpenAlert(false)}
				msg={"Perfil actualizado!"}
				autoHideDuration={3000}
				posHorizontal={"right"}
				posVertical={"bottom"}
			></NotificationAlert>
		</React.Fragment>
	);
}
