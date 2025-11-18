"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chip, FormHelperText, IconButton, MenuItem } from "@mui/material";
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
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

import { ChatContext } from "./chat-context";
import { LoanSimulation } from "./loan-simulation";

const schema = zod.object({
	name: zod.string().min(1, { message: "El nombre es obligatorio" }),
	documentType: zod.enum(["CC", "CE", "TE"], {
		errorMap: () => ({ message: "Debes elegir un tipo de documento" }),
	}),
	document: zod.string().min(1, { message: "El documento es obligatorio" }),
	address: zod.string().min(1, { message: "La dirección es obligatoria" }),
	address2: zod.string().optional(),

	email: zod.string().min(1, { message: "El correo es obligatorio" }).email(),
	phone: zod.string().min(1, { message: "El teléfono es obligatorio" }),
	phone2: zod.string().optional(),

	country: zod.string().min(1, { message: "El país es obligatorio" }),
	city: zod.string().min(1, { message: "La ciudad es obligatoria" }),

	referenceName: zod.string().optional(),
	referencePhone: zod.string().optional(),
	referenceRelationship: zod.string().optional(),
});

const COUNTRIES = [
	{ iso2: "CO", name: "Colombia", phoneCode: "57" },
	{ iso2: "CR", name: "Costa Rica", phoneCode: "506" },
];

function parseStoredPhone(phone) {
	const digits = String(phone || "").replace(/\D/g, "");
	if (!digits) return { iso2: "CO", local: "" }; // por defecto CO

	const match = COUNTRIES.slice()
		.sort((a, b) => b.phoneCode.length - a.phoneCode.length) // prefijo más largo primero
		.find((c) => digits.startsWith(c.phoneCode));

	if (!match) return { iso2: "CO", local: digits }; // fallback
	return { iso2: match.iso2, local: digits.slice(match.phoneCode.length) };
}

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

	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			documentType: "",
			document: "",
			address: "",
			address2: "",
			email: "",
			phone: "",
			phone2: "",
			country: "",
			city: "",
			referenceName: "",
			referencePhone: "",
			referenceRelationship: "",
		},
	});

	const [threadFound, setThreadFound] = React.useState({
		id: "",
		type: "",
		participants: [],
	});

	const [contactFound, setContactFound] = React.useState({
		id: null,
		country: "",
		city: "",
		name: "",
		phone: "",
		email: null,
		document: null,
		documentType: null,
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
				setContactFound({ ...contactFound, ...contact });
			}
		}
	}, [threadFound, contacts]);

	// Cuando cambia contactFound, actualiza hace el reset
	React.useEffect(() => {
		if (contactFound?.id) {
			reset({
				name: contactFound.name || "",
				documentType: contactFound.documentType || "",
				document: contactFound.document || "",
				address: contactFound.address || "",
				address2: contactFound.address2 || "",
				email: contactFound.email || "",
				phone: parseStoredPhone(contactFound?.phone)?.local || "",
				phone2: contactFound.phone2 || "",
				country: parseStoredPhone(contactFound.phone).iso2 || "",
				city: contactFound.city || "",
				referenceName: contactFound.referenceName || "",
				referencePhone: contactFound.referencePhone || "",
				referenceRelationship: contactFound.referenceRelationship || "",
			});
		}
	}, [contactFound]);

	const onSubmit = React.useCallback(
		async (dataForm) => {
			// setIsPending(true);
			const countryData = COUNTRIES.find((c) => c.iso2 === dataForm.country);
			const phoneCode = countryData ? countryData.phoneCode : "";
			const fullPhone = `${phoneCode}${dataForm.phone.replace(/\D/g, "")}`;

			const payload = {
				...dataForm,
				phone: fullPhone,
			};

			delete payload.country;

			const response = await updateCustomer(payload, contactFound.id);

			if (response.status == 200) setOpenAlert(true);
			router.refresh();
			setIsPending(false);
		},
		[contactFound]
	);

	const handleChangeCountry = (e) => {
		const { name, value } = e.target;
		setValue(name, value);
	};

	const selectedCountryIso2 = watch("country");
	const currentCountry = COUNTRIES.find((c) => c.iso2 === selectedCountryIso2);

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
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="country"
									render={({ field }) => (
										<FormControl required fullWidth disabled error={Boolean(errors.country)}>
											<InputLabel id="country-label">País</InputLabel>
											<Select {...field} labelId="country-label" label="País" onChange={handleChangeCountry}>
												{COUNTRIES.map((c) => (
													<MenuItem key={c.iso2} value={c.iso2}>
														{`${c.name} (+${c.phoneCode})`}
													</MenuItem>
												))}
											</Select>
											{errors.country ? <FormHelperText>{errors.country.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="city"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.city)}>
											<InputLabel>Ciudad</InputLabel>
											<OutlinedInput {...field} type="text" />
											{errors.city ? <FormHelperText>{errors.city.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="name"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.name)}>
											<InputLabel>Nombre Completo</InputLabel>
											<OutlinedInput {...field} type="text" />
											{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="documentType"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.documentType)}>
											<InputLabel id="document-type-label">Tipo de Documento</InputLabel>
											<Select {...field} labelId="document-type-label">
												<MenuItem value="CC">Cedula de Ciudadania</MenuItem>
												<MenuItem value="CE">Cedula de Extranjeria</MenuItem>
												<MenuItem value="TE">Tarjeta de extranjería</MenuItem>
											</Select>
											{errors.documentType ? <FormHelperText>{errors.documentType.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="document"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.document)}>
											<InputLabel>Cedula</InputLabel>
											<OutlinedInput {...field} type="text" />
											{errors.document ? <FormHelperText>{errors.document.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="address"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.address)}>
											<InputLabel>Dirección</InputLabel>
											<OutlinedInput {...field} type="text" />
											{errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
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
										<FormControl required fullWidth error={Boolean(errors.email)}>
											<InputLabel>Correo</InputLabel>
											<OutlinedInput {...field} type="email" />
											{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid
								size={{
									md: 6,
									xs: 12,
								}}
							>
								<Controller
									control={control}
									name="phone"
									render={({ field }) => (
										<FormControl required fullWidth error={Boolean(errors.phone)}>
											<InputLabel>Numero Celular</InputLabel>
											<OutlinedInput
												{...field}
												type="phone"
												startAdornment={
													<Chip
														size="small"
														label={currentCountry ? `+${currentCountry.phoneCode}` : "+??"}
														sx={{ mr: 1 }}
													/>
												}
											/>
											{errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="phone2"
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Celular 2</InputLabel>
											<OutlinedInput {...field} type="text" />
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="address2"
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Dirección 2</InputLabel>
											<OutlinedInput {...field} type="text" />
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="referenceName"
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Nombre de Referencia</InputLabel>
											<OutlinedInput {...field} type="text" />
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="referencePhone"
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Teléfono de Referencia</InputLabel>
											<OutlinedInput {...field} type="text" />
										</FormControl>
									)}
								/>
							</Grid>
							<Grid size={{ md: 6, xs: 12 }}>
								<Controller
									control={control}
									name="referenceRelationship"
									render={({ field }) => (
										<FormControl fullWidth>
											<InputLabel>Parentesco</InputLabel>
											<OutlinedInput {...field} type="text" />
										</FormControl>
									)}
								/>
							</Grid>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<Button variant="contained" type="submit" disabled={isPending}>
								Guardar
							</Button>
						</Grid>
						<Grid
							size={{
								md: 6,
								xs: 12,
							}}
						>
							<LoanSimulation contact={contactFound} />
						</Grid>
					</Stack>
				</form>
			</Box>

			<NotificationAlert
				openAlert={openAlert}
				onClose={() => setOpenAlert(false)}
				msg={"Perfil actualizado!"}
			></NotificationAlert>
		</React.Fragment>
	);
}
