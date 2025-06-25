"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createPaymentInformation } from "@/app/dashboard/configuration/payment-information/hooks/use-payments-information";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid2,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function PaymentAccountInformation({ paymentAccount }) {
	const router = useRouter();
	const notificationAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const schema = zod.object({
		name: zod
			.string()
			.min(3, { message: "Debe tener al menos 3 caracteres" })
			.max(100, { message: "Máximo 100 caracteres" })
			.regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
				message: "Debe ingresar nombre y apellido, solo letras y espacios",
			}),
		documentId: zod
			.string()
			.min(8, { message: "El documento es obligatorio" })
			.max(10, { message: "El documento es muy largo" })
			.regex(/^\d+$/, {
				message: "El documento debe contener solo números",
			}),
		bankName: zod.enum(["BANCOLOMBIA", "BBVA"], {
			errorMap: () => ({ message: "Debes elegir un banco" }),
		}),
		accountType: zod.enum(["SAVINGS", "CHECKING"], {
			errorMap: () => ({ message: "Debes elegir un tipo de cuenta" }),
		}),
		accountNumber: zod
			.string()
			.min(10, "El numero de cuenta es muy corto")
			.max(16, "El numero de cuenta es muy largo")
			.regex(/^\d+$/, {
				message: "El numero de cuenta debe contener solo números",
			}),
		currency: zod.enum(["COP", "USD"], {
			errorMap: () => ({ message: "Debes elegir un tipo de moneda" }),
		}),
		limit: zod
			.number({ invalid_type_error: "El monto debe ser un número" })
			.min(1, { message: "El monto es obligatorio" }),
		isPrimary: zod.any().optional(),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: paymentAccount.holderName,
			documentId: paymentAccount.holderDocument,
			bankName: paymentAccount.bankName.toUpperCase(),
			accountType: paymentAccount.accountType.toUpperCase(),
			accountNumber: paymentAccount.accountNumber,
			currency: paymentAccount.currency,
			limit: paymentAccount.limit,
			isPrimary: paymentAccount.isPrimary,
		},
	});

	React.useEffect(() => {
		if (paymentAccount) {
			reset({
				name: paymentAccount.holderName,
				documentId: paymentAccount.holderDocument,
				bankName: paymentAccount.bankName?.toUpperCase(),
				accountType: paymentAccount.accountType?.toUpperCase(),
				accountNumber: paymentAccount.accountNumber,
				currency: paymentAccount.currency,
				limit: paymentAccount.limit,
				isPrimary: paymentAccount.isPrimary,
			});
		}
	}, [paymentAccount]);

	const onSubmit = async (dataForm) => {
		try {
			const body = {
				holderName: dataForm.name,
				holderDocument: dataForm.documentId,
				bankName: dataForm.bankName,
				accountNumber: dataForm.accountNumber,
				accountType: dataForm.accountType,
				currency: dataForm.currency,
				limit: dataForm.limit,
				isPrimary: dataForm.isPrimary,
			};
			await createPaymentInformation(body);
			setAlertMsg("¡Creado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			notificationAlert.handleOpen();
			router.refresh();
			reset();
		}
	};

	return (
		<Box component={"form"} onSubmit={handleSubmit(onSubmit)} padding={3}>
			<Grid2 container spacing={3}>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.name)}>
								<InputLabel required>Nombre completo</InputLabel>
								<OutlinedInput {...field} />
								{errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="documentId"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.documentId)}>
								<InputLabel required>Numero de documento</InputLabel>
								<OutlinedInput {...field} />
								{errors.documentId ? <FormHelperText>{errors.documentId.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="bankName"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.bankName)}>
								<InputLabel id="bankName" required>
									Nombre del banco
								</InputLabel>
								<Select {...field} labelId="bankName">
									<MenuItem value="BBVA">BBVA</MenuItem>
									<MenuItem value="BANCOLOMBIA">BANCOLOMBIA</MenuItem>
								</Select>
								{errors.bankName ? <FormHelperText>{errors.bankName.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="accountType"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.accountType)}>
								<InputLabel id="accountType" required>
									Tipo de cuenta
								</InputLabel>
								<Select {...field} labelId="accountType">
									<MenuItem value="SAVINGS">Ahorros</MenuItem>
									<MenuItem value="CHECKING">Corriente</MenuItem>
								</Select>
								{errors.accountType ? <FormHelperText>{errors.accountType.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="accountNumber"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.accountNumber)}>
								<InputLabel required>Numero de cuenta</InputLabel>
								<OutlinedInput {...field} />
								{errors.accountNumber ? <FormHelperText>{errors.accountNumber.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="currency"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.currency)}>
								<InputLabel id="currency" required>
									Moneda
								</InputLabel>
								<Select {...field} labelId="currency">
									<MenuItem value="COP">COP</MenuItem>
									<MenuItem value="USD">USD</MenuItem>
								</Select>
								{errors.currency ? <FormHelperText>{errors.currency.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						control={control}
						name="limit"
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.limit)}>
								<InputLabel required>Limite</InputLabel>
								<OutlinedInput
									{...field}
									value={field.value !== undefined && field.value !== null ? formatCurrency(field.value) : ""}
									onChange={(e) => {
										const raw = deleteAlphabeticals(e.target.value);
										const numericValue = raw ? Number.parseInt(raw, 10) : 0;
										field.onChange(numericValue);
									}}
									inputProps={{ inputMode: "numeric" }}
								/>
								{errors.limit ? <FormHelperText>{errors.limit.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 6,
						xs: 12,
					}}
				>
					<Controller
						name="isPrimary"
						control={control}
						defaultValue={false}
						render={({ field }) => (
							<FormControl fullWidth error={Boolean(errors.limit)}>
								<Stack spacing={1}>
									<Typography variant="subtitle2">Cuenta principal</Typography>
									<Switch checked={field.value} onChange={field.onChange} name={field.name} />
								</Stack>
							</FormControl>
						)}
					/>
				</Grid2>
				<Grid2
					size={{
						md: 12,
						xs: 12,
					}}
				>
					<Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
						<Button color="secondary" variant="outlined">
							Editar
						</Button>
						<Button variant="contained" type="submit">
							Guardar
						</Button>
					</Stack>
				</Grid2>
			</Grid2>
			<NotificationAlert
				openAlert={notificationAlert.open}
				onClose={notificationAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</Box>
	);
}
