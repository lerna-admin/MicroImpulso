"use client";

import * as React from "react";
import RouterLink from "next/link";
import {
  MenuItem,
  Typography,
  Chip,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TypographyMUI from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { createCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { createRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";
import { ROLES } from "@/constants/roles";

/* ====== Países soportados ====== */
const COUNTRIES = [
  { iso2: "CO", name: "Colombia", phoneCode: "57" },
  { iso2: "CR", name: "Costa Rica", phoneCode: "506" },
];

function flagFromCountryCode(code) {
  if (!code || typeof code !== "string") return "🌐";
  try {
    const cc = code.trim().toUpperCase();
    if (cc.length !== 2) return "🌐";
    const A = 0x1f1e6;
    return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65));
  } catch {
    return "🌐";
  }
}

function composePhone(iso2, local) {
  const c = COUNTRIES.find((x) => x.iso2 === iso2);
  const localDigits = String(local || "").replace(/\D/g, "");
  return (c ? c.phoneCode : "") + localDigits; // sin '+'
}

export function CustomerCreateForm({ user }) {
  const [alertMsg, setAlertMsg] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [openAlert, setOpenAlert] = React.useState(false);

  // ID del cliente creado (habilita sección de solicitud)
  const [createdClientId, setCreatedClientId] = React.useState(null);

  const DEFAULT_COUNTRY = "CO";

  const defaultValues = {
    // Cliente
    countryIso2: DEFAULT_COUNTRY,
    name: "",
    email: "",
    localPhone: "",
    localPhone2: "",
    documentType: "",
    document: "",
    address: "",
    address2: "",
    referenceName: "",
    referencePhone: "",
    referenceRelationship: "",
    // Solicitud
    amount: 0,
    typePayment: "",
    datePayment: "",
    selectedDate: dayjs(),
    selectedAgent: "",
  };

  // ====== Validación cliente ======
  const clientOnlySchema = zod.object({
    countryIso2: zod
      .string()
      .length(2, "Selecciona un país válido")
      .refine((v) => COUNTRIES.some((c) => c.iso2 === v), "País no soportado"),
    name: zod
      .string()
      .min(3, { message: "Debe tener al menos 3 caracteres" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
        message: "Debe ingresar nombre y apellido, solo letras y espacios",
      }),
    email: zod.string().email("Debe ser un correo válido").min(5).max(255),
    localPhone: zod.string().min(7).max(10).regex(/^\d+$/),
    localPhone2: zod
      .string()
      .optional()
      .refine((val) => !val || (/^\d+$/.test(val) && val.length >= 7 && val.length <= 10), {
        message: "El celular 2 debe ser numérico (7 a 10 dígitos)",
      }),
    documentType: zod.enum(["CC", "CE", "TE"], { errorMap: () => ({ message: "Debes elegir un tipo de documento" }) }),
    document: zod.string().min(5).max(20).regex(/^[A-Za-z0-9]+$/),
    address: zod.string().min(5).max(255),
    address2: zod.string().max(255).optional(),
    referenceName: zod
      .string()
      .min(3, { message: "El nombre de la referencia es obligatorio" })
      .max(100, { message: "Máximo 100 caracteres" })
      .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
        message: "Debe ingresar nombre y apellido, solo letras y espacios",
      }),
    referencePhone: zod.string().min(7).max(10).regex(/^\d+$/),
    referenceRelationship: zod.string().min(3).max(50),
  });

  // ====== Validación solicitud ======
  const requestSchemaOnly = zod
    .object({
      amount: zod
        .number({ invalid_type_error: "El monto debe ser un número" })
        .min(50_000, { message: "El monto debe superar los $50.000" })
        .max(5_000_000, { message: "El monto no puede superar los 5.000.000" }),
      typePayment: zod.enum(["QUINCENAL", "MENSUAL"], {
        errorMap: () => ({ message: "Debes elegir un tipo de pago" }),
      }),
      datePayment: zod.enum(["15-30", "5-20", "10-25"], {
        errorMap: () => ({ message: "Debes elegir una fecha de pago" }),
      }),
      selectedDate: zod
        .custom((val) => dayjs.isDayjs(val) && val.isValid(), { message: "La fecha es obligatoria" })
        .refine((val) => dayjs(val).isAfter(dayjs(), "day"), { message: "La fecha debe ser posterior a hoy" }),
      selectedAgent: zod.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (user.role === ROLES.ADMIN && !data.selectedAgent?.trim()) {
        ctx.addIssue({
          path: ["selectedAgent"],
          code: zod.ZodIssueCode.custom,
          message: "El campo agente es obligatorio para administradores",
        });
      }
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    defaultValues,
  });

  const countryIso2 = watch("countryIso2");

  const openToast = (msg, severity = "success") => {
    setAlertMsg(msg);
    setAlertSeverity(severity);
    setOpenAlert(true);
  };

  // ====== Guardar SOLO cliente ======
  const handleSaveClientOnly = async () => {
    try {
      // validación local de cliente
      const values = getValues();
      const parsed = clientOnlySchema.safeParse(values);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues?.[0];
        openToast(firstIssue?.message || "Revisa los campos del cliente", "error");
        return;
      }

      const phone = composePhone(values.countryIso2, values.localPhone);
      const phone2 = values.localPhone2 ? composePhone(values.countryIso2, values.localPhone2) : null;
      const referencePhone = composePhone(values.countryIso2, values.referencePhone);

      const bodyCustomer = {
        name: values.name,
        email: values.email,
        phone,
        phone2,
        documentType: values.documentType,
        document: values.document,
        address: values.address,
        address2: values.address2 || null,
        referenceName: values.referenceName,
        referencePhone,
        referenceRelationship: values.referenceRelationship,
        status: "PROSPECT",
      };

      const created = await createCustomer(bodyCustomer);
      const newId = created?.id ?? null;
      setCreatedClientId(newId);

      if (newId) openToast("¡Cliente creado exitosamente!", "success");
      else openToast("No se pudo obtener el ID del cliente", "warning");
    } catch (err) {
      openToast(err?.message || "Error al crear el cliente", "error");
    }
  };

  // ====== Guardar SOLO solicitud (submit del form) ======
  const onSubmit = async (dataForm) => {
    try {
      if (!createdClientId) {
        openToast("Primero debes guardar el cliente antes de crear la solicitud.", "error");
        return;
      }

      // validación local de solicitud
      const parsedReq = requestSchemaOnly.safeParse({
        amount: dataForm.amount,
        typePayment: dataForm.typePayment,
        datePayment: dataForm.datePayment,
        selectedDate: dataForm.selectedDate,
        selectedAgent: dataForm.selectedAgent,
      });
      if (!parsedReq.success) {
        const firstIssue = parsedReq.error.issues?.[0];
        openToast(firstIssue?.message || "Revisa los campos de la solicitud", "error");
        return;
      }

      const agentId = user.role === ROLES.AGENTE ? String(user.id) : dataForm.selectedAgent;

      const bodyRequest = {
        client: createdClientId,
        agent: agentId,
        status: "new",
        requestedAmount: dataForm.amount,
        endDateAt: dataForm.selectedDate,
        amount: dataForm.amount * 1.2,
        paymentDay: dataForm.datePayment,
        type: dataForm.typePayment,
      };

      await createRequest(bodyRequest);
      openToast("¡Solicitud creada exitosamente!", "success");

      // reiniciar para un nuevo flujo
      setCreatedClientId(null);
      reset({ ...defaultValues, countryIso2: DEFAULT_COUNTRY });
    } catch (err) {
      openToast(err?.message || "Error al crear la solicitud", "error");
    }
  };

  // Evitar submit por Enter “fantasma”
  const onKeyDown = (e) => {
    if (e.key === "Enter" && e.target?.tagName?.toLowerCase() !== "textarea") {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} onKeyDown={onKeyDown}>
      <Card>
        <CardContent>
          <Typography variant="h5" paddingTop={3}>
            Crear cliente
          </Typography>

          <Stack spacing={3} paddingTop={3} divider={<Divider />}>
            <Grid container spacing={3}>
              {/* País */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="countryIso2"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.countryIso2)} fullWidth>
                      <InputLabel required>País</InputLabel>
                      <Select
                        {...field}
                        renderValue={(v) => {
                          const c = COUNTRIES.find((x) => x.iso2 === v);
                          return (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <span style={{ fontSize: 18 }}>{flagFromCountryCode(v)}</span>
                              <span>{c ? `${c.name} (+${c.phoneCode})` : v}</span>
                            </Box>
                          );
                        }}
                      >
                        {COUNTRIES.map((c) => (
                          <MenuItem key={c.iso2} value={c.iso2}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <span style={{ fontSize: 18 }}>{flagFromCountryCode(c.iso2)}</span>
                              <span>{c.name}</span>
                              <Chip size="small" label={`+${c.phoneCode}`} sx={{ ml: 1 }} />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.countryIso2 ? <FormHelperText>{errors.countryIso2.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Nombre */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.name)} fullWidth>
                      <InputLabel required>Nombre completo</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Correo */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)} fullWidth>
                      <InputLabel required>Correo</InputLabel>
                      <OutlinedInput {...field} type="email" />
                      {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Celular */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="localPhone"
                  render={({ field }) => {
                    const c = COUNTRIES.find((x) => x.iso2 === countryIso2);
                    return (
                      <FormControl error={Boolean(errors.localPhone)} fullWidth>
                        <InputLabel required>N. de celular (local)</InputLabel>
                        <OutlinedInput
                          {...field}
                          startAdornment={<Chip label={c ? `+${c.phoneCode}` : "+??"} size="small" sx={{ mr: 1 }} />}
                          inputProps={{ inputMode: "numeric" }}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        />
                        {errors.localPhone ? <FormHelperText>{errors.localPhone.message}</FormHelperText> : null}
                      </FormControl>
                    );
                  }}
                />
              </Grid>

              {/* Celular 2 */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="localPhone2"
                  render={({ field }) => {
                    const c = COUNTRIES.find((x) => x.iso2 === countryIso2);
                    return (
                      <FormControl error={Boolean(errors.localPhone2)} fullWidth>
                        <InputLabel>Celular 2 (local, opcional)</InputLabel>
                        <OutlinedInput
                          {...field}
                          startAdornment={<Chip label={c ? `+${c.phoneCode}` : "+??"} size="small" sx={{ mr: 1 }} />}
                          inputProps={{ inputMode: "numeric" }}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        />
                        {errors.localPhone2 ? <FormHelperText>{errors.localPhone2.message}</FormHelperText> : null}
                      </FormControl>
                    );
                  }}
                />
              </Grid>

              {/* Documento */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="documentType"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.documentType)} fullWidth>
                      <InputLabel required>Tipo de documento</InputLabel>
                      <Select {...field}>
                        <MenuItem value="CC">Cedula de Ciudadania</MenuItem>
                        <MenuItem value="CE">Cedula de Extranjeria</MenuItem>
                        <MenuItem value="TE">Tarjeta de extranjería</MenuItem>
                      </Select>
                      {errors.documentType ? <FormHelperText>{errors.documentType.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="document"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.document)} fullWidth>
                      <InputLabel required>N. de documento</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.document ? <FormHelperText>{errors.document.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Dirección */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.address)} fullWidth>
                      <InputLabel required>Dirección</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.address ? <FormHelperText>{errors.address.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Dirección 2 */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="address2"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.address2)} fullWidth>
                      <InputLabel>Dirección 2 (opcional)</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.address2 ? <FormHelperText>{errors.address2.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Referencia */}
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="referenceName"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.referenceName)} fullWidth>
                      <InputLabel required>Nombre completo de la referencia</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.referenceName ? <FormHelperText>{errors.referenceName.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="referenceRelationship"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.referenceRelationship)} fullWidth>
                      <InputLabel required>Parentesco / Relación</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.referenceRelationship ? <FormHelperText>{errors.referenceRelationship.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="referencePhone"
                  render={({ field }) => {
                    const c = COUNTRIES.find((x) => x.iso2 === countryIso2);
                    return (
                      <FormControl error={Boolean(errors.referencePhone)} fullWidth>
                        <InputLabel required>Teléfono de la referencia</InputLabel>
                        <OutlinedInput
                          {...field}
                          startAdornment={<Chip label={c ? `+${c.phoneCode}` : "+??"} size="small" sx={{ mr: 1 }} />}
                          inputProps={{ inputMode: "numeric" }}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        />
                        {errors.referencePhone ? <FormHelperText>{errors.referencePhone.message}</FormHelperText> : null}
                      </FormControl>
                    );
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          {/* IMPORTANTE: no es submit */}
          <Button variant="contained" type="button" onClick={handleSaveClientOnly}>
            Guardar cliente
          </Button>
        </CardActions>
      </Card>

      {/* ==================== SOLICITUD ==================== */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" paddingTop={3}>
            Crear solicitud
          </Typography>

          <Stack spacing={3} paddingTop={3} divider={<Divider />}>
            <Grid container spacing={3}>
              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="amount"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.amount)} fullWidth disabled={!createdClientId}>
                      <InputLabel required>Monto solicitado</InputLabel>
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
                      {errors.amount ? <FormHelperText>{errors.amount.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="typePayment"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.typePayment)} fullWidth disabled={!createdClientId}>
                      <InputLabel required>Tipo de pago</InputLabel>
                      <Select {...field}>
                        <MenuItem value="QUINCENAL">Quincenal</MenuItem>
                        <MenuItem value="MENSUAL">Mensual</MenuItem>
                      </Select>
                      {errors.typePayment ? <FormHelperText>{errors.typePayment.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="datePayment"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.datePayment)} fullWidth disabled={!createdClientId}>
                      <InputLabel required>Fecha de pago</InputLabel>
                      <Select {...field}>
                        <MenuItem value="15-30">15 - 30</MenuItem>
                        <MenuItem value="5-20">5 - 20</MenuItem>
                        <MenuItem value="10-25">10 - 25</MenuItem>
                      </Select>
                      {errors.datePayment ? <FormHelperText>{errors.datePayment.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid size={{ md: 6, xs: 12 }}>
                <Controller
                  control={control}
                  name="selectedDate"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.selectedDate)} fullWidth disabled={!createdClientId}>
                      <InputLabel required>Día a pagar</InputLabel>
                      <DatePicker {...field} minDate={dayjs()} sx={{ marginTop: "0.5rem" }} />
                      {errors.selectedDate ? <FormHelperText>{errors.selectedDate.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Agente (si ADMIN, elige; si AGENTE, se fija en backend) */}
              {user.role === ROLES.ADMIN ? (
                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="selectedAgent"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.selectedAgent)} fullWidth disabled={!createdClientId}>
                        <InputLabel required>Agente</InputLabel>
                        <Select {...field}>
                          {/* Rellena con tus opciones reales */}
                          <MenuItem value="">Selecciona un agente</MenuItem>
                          {/* Ejemplo: <MenuItem value="123">Juan Pérez</MenuItem> */}
                        </Select>
                        {errors.selectedAgent ? <FormHelperText>{errors.selectedAgent.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              ) : null}
            </Grid>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list} type="button">
            Cancelar
          </Button>
          {/* ÚNICO submit real */}
          <Button variant="contained" type="submit" disabled={!createdClientId} aria-disabled={!createdClientId}>
            Guardar
          </Button>
        </CardActions>
      </Card>

      <NotificationAlert
        openAlert={openAlert}
        onClose={() => setOpenAlert(false)}
        msg={alertMsg}
        severity={alertSeverity}
      />
    </form>
  );
}
