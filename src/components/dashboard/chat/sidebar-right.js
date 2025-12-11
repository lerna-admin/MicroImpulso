"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { updateRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Chip, CircularProgress, FormHelperText, IconButton, MenuItem } from "@mui/material";
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
import { getClientLoanSnapshot } from "@/app/dashboard/chat/hooks/use-conversations";
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

const LOAN_STATUS_CONFIG = {
	new: { label: "Nueva", color: "info" },
	under_review: { label: "En estudio", color: "warning" },
	approved: { label: "Aprobada", color: "success" },
	funded: { label: "Desembolsado", color: "primary" },
	renewed: { label: "Renovado", color: "success" },
	completed: { label: "Completado", color: "default" },
	rejected: { label: "Rechazada", color: "error" },
};

const LOAN_STATUS_TRANSITIONS = {
	new: ["under_review", "rejected"],
	under_review: ["approved", "rejected"],
	approved: ["funded", "rejected"],
	funded: ["completed"],
	completed: [],
	rejected: [],
	renewed: [],
};

const STATUS_REQUIRES_AMOUNT = new Set(["approved", "funded"]);

const currencyFormatter = new Intl.NumberFormat("es-CO", {
	style: "currency",
	currency: "COP",
	minimumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

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
		formState: { errors, isDirty },
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
	const [alertMessage, setAlertMessage] = React.useState("Perfil actualizado!");
	const [loanSnapshot, setLoanSnapshot] = React.useState({
		loan: null,
		loading: false,
		error: null,
	});
	const [loanActionPending, setLoanActionPending] = React.useState(false);
	const [loanActionError, setLoanActionError] = React.useState(null);
	const clientIdRef = React.useRef(null);
	const currentClientId = contactFound?.id ?? null;
	const loanStatusKey = loanSnapshot.loan?.status ? String(loanSnapshot.loan.status).toLowerCase() : null;
	const loanStatusConfig = loanStatusKey ? LOAN_STATUS_CONFIG[loanStatusKey] : null;
	const nextLoanStatuses = loanStatusKey ? LOAN_STATUS_TRANSITIONS[loanStatusKey] ?? [] : [];
	const requestedAmountValue = Number(loanSnapshot.loan?.requestedAmount ?? 0);
	const hasRequestedAmount = Number.isFinite(requestedAmountValue) && requestedAmountValue > 0;

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
				setContactFound((prev) => ({ ...prev, ...contact }));
			}
		}
	}, [threadFound, contacts]);

		const lastContactIdRef = React.useRef(null);

		// Resetea el formulario al cambiar de contacto o cuando no hay cambios locales
		React.useEffect(() => {
			const nextId = contactFound?.id ?? null;
			if (!nextId) return;

			const isContactChanged = lastContactIdRef.current !== nextId;
			if (!isContactChanged && isDirty) {
				return;
			}

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
			lastContactIdRef.current = nextId;
		}, [contactFound, reset, isDirty]);

	const loadLoanSnapshot = React.useCallback(async () => {
		const targetId = clientIdRef.current;
		if (!targetId) {
			setLoanSnapshot({ loan: null, loading: false, error: null });
			return;
		}
		setLoanSnapshot((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const loan = await getClientLoanSnapshot(targetId);
			if (clientIdRef.current !== targetId) {
				return;
			}
			setLoanSnapshot({ loan, loading: false, error: null });
			setLoanActionError(null);
		} catch (error) {
			if (clientIdRef.current !== targetId) {
				return;
			}
			setLoanSnapshot({
				loan: null,
				loading: false,
				error: error?.message || "No se pudo cargar la solicitud.",
			});
		}
	}, []);

	React.useEffect(() => {
		clientIdRef.current = currentClientId;
		setLoanActionError(null);
		setLoanActionPending(false);
		loadLoanSnapshot();
	}, [currentClientId, loadLoanSnapshot]);

	const showAlert = React.useCallback((message) => {
		setAlertMessage(message);
		setOpenAlert(true);
	}, []);

	const onSubmit = React.useCallback(
		async (dataForm) => {
			setIsPending(true);
			try {
				const countryData = COUNTRIES.find((c) => c.iso2 === dataForm.country);
				const phoneCode = countryData ? countryData.phoneCode : "";
				const fullPhone = `${phoneCode}${dataForm.phone.replace(/\D/g, "")}`;

				const payload = {
					...dataForm,
					phone: fullPhone,
				};

				delete payload.country;

				const response = await updateCustomer(payload, contactFound.id);

				if (response.status === 200) {
					showAlert("Perfil actualizado!");
					reset(dataForm); // mantener formulario sincronizado con lo guardado
				}
				router.refresh();
			} catch (error) {
				console.error("Error al actualizar el perfil del cliente", error);
			} finally {
				setIsPending(false);
			}
		},
		[contactFound, router, showAlert]
	);

	const handleChangeCountry = (e) => {
		const { name, value } = e.target;
		setValue(name, value);
	};

	const handleLoanStatusChange = React.useCallback(
		async (nextStatus) => {
			if (!loanSnapshot.loan?.id) return;
			if (!nextStatus) return;
			if (loanSnapshot.loan.status === nextStatus) return;
			const requiresAmount = STATUS_REQUIRES_AMOUNT.has(nextStatus);
			if (requiresAmount && !hasRequestedAmount) {
				setLoanActionError("Asigna un monto solicitado mayor a 0 antes de actualizar el estado.");
				return;
			}
			setLoanActionError(null);
			setLoanActionPending(true);
			try {
				await updateRequest({ status: nextStatus }, loanSnapshot.loan.id);
				showAlert("Estado del préstamo actualizado");
				await loadLoanSnapshot();
				router.refresh();
			} catch (error) {
				setLoanActionError(error?.message || "No se pudo actualizar el estado.");
			} finally {
				setLoanActionPending(false);
			}
		},
		[hasRequestedAmount, loanSnapshot.loan, loadLoanSnapshot, router, showAlert]
	);

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
						<Box
							sx={{
								border: "1px solid var(--mui-palette-divider)",
								borderRadius: 2,
								p: 2,
							}}
						>
							<Stack spacing={2}>
								<Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
									<Typography variant="subtitle1">Estado del préstamo</Typography>
									<Button
										size="small"
										variant="text"
										onClick={loadLoanSnapshot}
										disabled={!currentClientId || loanSnapshot.loading}
									>
										Actualizar
									</Button>
								</Stack>
								{!currentClientId ? (
									<Typography color="text.secondary" variant="body2">
										Selecciona un chat para ver la solicitud del cliente.
									</Typography>
								) : loanSnapshot.loading ? (
									<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
										<CircularProgress size={18} />
										<Typography color="text.secondary" variant="body2">
											Cargando estado...
										</Typography>
									</Stack>
								) : loanSnapshot.error ? (
									<Alert
										severity="error"
										action={
											<Button color="inherit" size="small" onClick={loadLoanSnapshot}>
												Reintentar
											</Button>
										}
									>
										{loanSnapshot.error}
									</Alert>
								) : loanSnapshot.loan ? (
									<>
										<Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
											<Chip
												color={loanStatusConfig?.color ?? "default"}
												label={loanStatusConfig?.label ?? loanSnapshot.loan.status}
												variant="outlined"
											/>
											<Typography color="text.secondary" variant="body2">
												Solicitado: {formatCurrency(requestedAmountValue)}
											</Typography>
										</Stack>
										{!hasRequestedAmount ? (
											<Alert severity="warning">
												Ingresa un monto solicitado mayor a 0 antes de aprobar o desembolsar esta solicitud.
											</Alert>
										) : null}
										{loanActionError ? <Alert severity="error">{loanActionError}</Alert> : null}
										{nextLoanStatuses.length ? (
											<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
												{nextLoanStatuses.map((nextStatus) => {
													const requiresAmount = STATUS_REQUIRES_AMOUNT.has(nextStatus);
													const disabled = loanActionPending || (requiresAmount && !hasRequestedAmount);
													return (
														<Button
															key={nextStatus}
															variant="outlined"
															size="small"
															disabled={disabled}
															onClick={() => handleLoanStatusChange(nextStatus)}
														>
															Marcar como {LOAN_STATUS_CONFIG[nextStatus]?.label ?? nextStatus}
														</Button>
													);
												})}
											</Stack>
										) : (
											<Typography color="text.secondary" variant="body2">
												No hay acciones disponibles para este estado.
											</Typography>
										)}
									</>
								) : (
									<Typography color="text.secondary" variant="body2">
										Este cliente no tiene solicitudes registradas.
									</Typography>
								)}
							</Stack>
						</Box>
					</Stack>
				</form>
			</Box>

			<NotificationAlert
				openAlert={openAlert}
				onClose={() => setOpenAlert(false)}
				msg={alertMessage}
			></NotificationAlert>
		</React.Fragment>
	);
}
