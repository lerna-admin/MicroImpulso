"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { createRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { ROLES } from "@/constants/roles";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MenuItem, Typography, Chip, Box, Tooltip,
  FormControl, FormHelperText, InputLabel, OutlinedInput,
  Select, Stack, Card, CardContent, CardActions, Snackbar, Grid as MuiGrid
} from "@mui/material";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { logger } from "@/lib/default-logger";
import { usePopover } from "@/hooks/use-popover";

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

export function CustomerCreateForm({ user }) {
  const router = useRouter();
  const popoverAlert = usePopover();

  const [agentsOptions, setAgentsOptions] = React.useState([]);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState("success");
  const [createdClientId, setCreatedClientId] = React.useState(null);

  const DEFAULT_COUNTRY = "CO";

  const defaultValues = {
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
    amount: 0,
    typePayment: "",
    datePayment: "",
    selectedDate: dayjs(),
    selectedAgent: "",
  };

  // ========= Esquema general (para crear solicitud) =========
  const schema = zod
    .object({
      countryIso2: zod.string().length(2, "Selecciona un país válido")
        .refine((v) => COUNTRIES.some((c) => c.iso2 === v), "País no soportado"),
      name: zod.string().min(3).max(100)
        .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, { message: "Debe ingresar nombre y apellido, solo letras y espacios" }),
      email: zod.string().email().min(5).max(255),
      localPhone: zod.string().min(7).max(10).regex(/^\d+$/),
      localPhone2: zod.string().optional().refine((val) => !val || (/^\d+$/.test(val) && val.length >= 7 && val.length <= 10), {
        message: "El celular 2 debe ser numérico (7 a 10 dígitos)",
      }),
      documentType: zod.enum(["CC", "CE", "TE"], { errorMap: () => ({ message: "Debes elegir un tipo de documento" }) }),
      document: zod.string().min(5).max(20).regex(/^[A-Za-z0-9]+$/),
      address: zod.string().min(5).max(255),
      address2: zod.string().max(255).optional(),
      amount: zod.number({ invalid_type_error: "El monto debe ser un número" }).min(1).min(50_000).max(5_000_000),
      typePayment: zod.enum(["QUINCENAL", "MENSUAL"], { errorMap: () => ({ message: "Debes elegir un tipo de pago" }) }),
      datePayment: zod.enum(["15-30", "5-20", "10-25"], { errorMap: () => ({ message: "Debes elegir una fecha de pago" }) }),
      selectedDate: zod
        .custom((val) => dayjs.isDayjs(val) && val.isValid(), { message: "La fecha es obligatoria" })
        .refine((val) => dayjs(val).isAfter(dayjs(), "day"), { message: "La fecha debe ser posterior a hoy" }),
      selectedAgent: zod.string().optional(),
      referenceName: zod.string().min(3).max(100)
        .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, { message: "Debe ingresar nombre y apellido, solo letras y espacios" }),
      referencePhone: zod.string().min(7).max(10).regex(/^\d+$/),
      referenceRelationship: zod.string().min(3).max(50),
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

  // ========= Esquema sólo cliente =========
  const clientOnlySchema = zod.object({
    countryIso2: zod.string().length(2).refine((v) => COUNTRIES.some((c) => c.iso2 === v), "País no soportado"),
    name: zod.string().min(3).max(100)
      .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, { message: "Debe ingresar nombre y apellido, solo letras y espacios" }),
    email: zod.string().email().min(5).max(255),
    localPhone: zod.string().min(7).max(10).regex(/^\d+$/),
    localPhone2: zod.string().optional(),
    documentType: zod.enum(["CC", "CE", "TE"]),
    document: zod.string().min(5).max(20).regex(/^[A-Za-z0-9]+$/),
    address: zod.string().min(5).max(255),
    address2: zod.string().max(255).optional(),
    referenceName: zod.string().min(3).max(100)
      .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/),
    referencePhone: zod.string().min(7).max(10).regex(/^\d+$/),
    referenceRelationship: zod.string().min(3).max(50),
  });

  const {
    control, handleSubmit, formState: { errors }, reset, watch, setValue, getValues,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const countryIso2 = watch("countryIso2");

  // ====== carga de agentes por país ======
  const fetchAgentsByCountry = React.useCallback(
    async (iso2) => {
      try {
        const res = await fetch(`/api/branches?countryIso2=${encodeURIComponent(iso2)}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const branches = await res.json();

        const allAgents = (branches || [])
          .flatMap((b) => (Array.isArray(b.agents) ? b.agents : []))
          .filter((a) => a && a.role === ROLES.AGENTE);

        const uniqMap = new Map(allAgents.map((a) => [a.id, a]));
        setAgentsOptions(Array.from(uniqMap.values()));
      } catch (error) {
        setAlertMsg(error?.message || "No fue posible cargar agentes");
        setAlertSeverity("error");
        popoverAlert.handleOpen();
        setAgentsOptions([]);
      }
    },
    [popoverAlert]
  );

  React.useEffect(() => {
    if (user.role === ROLES.ADMIN) {
      fetchAgentsByCountry(countryIso2);
    } else {
      setAgentsOptions([]);
      setValue("selectedAgent", "");
    }
  }, [countryIso2, user.role, fetchAgentsByCountry, setValue]);

  function composePhone(iso2, local) {
    const c = COUNTRIES.find((x) => x.iso2 === iso2);
    const localDigits = String(local || "").replace(/\D/g, "");
    return (c ? c.phoneCode : "") + localDigits; // sin '+'
  }

  // ====== Guardar SOLO cliente ======
  const handleSaveClientOnly = React.useCallback(async () => {
    try {
      const values = getValues();
      const parsed = clientOnlySchema.safeParse(values);
      if (!parsed.success) {
        const firstIssue = parsed.error.issues?.[0];
        setAlertMsg(firstIssue?.message || "Revisa los campos del cliente");
        setAlertSeverity("error");
        popoverAlert.handleOpen();
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

      setAlertMsg(newId ? "¡Cliente creado exitosamente!" : "No se pudo obtener el ID del cliente");
      setAlertSeverity(newId ? "success" : "warning");
    } catch (error) {
      setAlertMsg(error?.message || "Error al crear el cliente");
      setAlertSeverity("error");
      logger.error(error);
    } finally {
      popoverAlert.handleOpen();
    }
  }, [clientOnlySchema, popoverAlert, getValues]);

  // ====== Guardar SOLO solicitud ======
  const onSubmit = React.useCallback(
    async (dataForm) => {
      try {
        if (!createdClientId) {
          setAlertMsg("Primero debes guardar el cliente antes de crear la solicitud.");
          setAlertSeverity("error");
          popoverAlert.handleOpen();
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

        setAlertMsg("¡Solicitud creada exitosamente!");
        setAlertSeverity("success");

        setCreatedClientId(null);
        reset({ ...defaultValues, countryIso2 });
      } catch (error) {
        setAlertMsg(error?.message || "Error al crear la solicitud");
        setAlertSeverity("error");
        logger.error(error);
      } finally {
        popoverAlert.handleOpen();
      }
    },
    [createdClientId, reset, popoverAlert, countryIso2, user]
  );

  const solicitudDisabled = !createdClientId;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Kill-switch local contra overlays huérfanos */}
      <style>{`
        /* Evita que un Backdrop/Modal huérfano bloquee clics */
        .MuiBackdrop-root { pointer-events: none !important; }
        .MuiModal-root[aria-hidden="true"] { display: none !important; }

        /* Popper default de algunos pickers/menus puede estirarse: aseguremos z-index y no cubrir layout */
        .MuiPopover-root, .MuiPopper-root, .MuiTooltip-popper { z-index: 1200 !important; }
      `}</style>

      <Stack spacing={4}>
        {/* ==================== DATOS DEL CLIENTE ==================== */}
        <Card>
          <CardContent>
            <Typography variant="h5" paddingTop={3}>
              Crear cliente
            </Typography>

            <Stack spacing={3} paddingTop={3}>
              <MuiGrid container spacing={3}>
                {/* País */}
                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="countryIso2"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.countryIso2)} fullWidth>
                        <InputLabel required>País</InputLabel>
                        <Select
                          {...field}
                          MenuProps={{ disablePortal: true, keepMounted: false }}
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
                </MuiGrid>

                {/* Nombre */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Correo */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Celular local */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Celular local 2 (opcional) */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Documento */}
                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="documentType"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.documentType)} fullWidth>
                        <InputLabel required>Tipo de documento</InputLabel>
                        <Select {...field} MenuProps={{ disablePortal: true, keepMounted: false }}>
                          <MenuItem value="CC">Cedula de Ciudadania</MenuItem>
                          <MenuItem value="CE">Cedula de Extranjeria</MenuItem>
                          <MenuItem value="TE">Tarjeta de extranjería</MenuItem>
                        </Select>
                        {errors.documentType ? <FormHelperText>{errors.documentType.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </MuiGrid>

                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Dirección */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Dirección 2 opcional */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>
              </MuiGrid>
            </Stack>
          </CardContent>
        </Card>

        {/* ==================== DATOS DE REFERENCIA ==================== */}
        <Card>
          <CardContent>
            <Typography variant="h5" paddingTop={3}>
              Datos de referencia
            </Typography>

            <Stack spacing={3} paddingTop={3}>
              <MuiGrid container spacing={3}>
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>

                {/* Teléfono de referencia */}
                <MuiGrid item md={6} xs={12}>
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
                </MuiGrid>
              </MuiGrid>

              {createdClientId ? (
                <Box sx={{ pt: 1 }}>
                  <Chip color="success" label={`Cliente guardado (ID: ${createdClientId})`} />
                </Box>
              ) : null}
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" type="button" onClick={handleSaveClientOnly}>
              Guardar cliente
            </Button>
          </CardActions>
        </Card>

        {/* ==================== SOLICITUD ==================== */}
        <Card>
          <CardContent>
            <Typography variant="h5" paddingTop={3}>
              Crear solicitud
            </Typography>

            <Stack spacing={3} paddingTop={3}>
              <MuiGrid container spacing={3}>
                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.amount)} fullWidth>
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
                </MuiGrid>

                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="typePayment"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.typePayment)} fullWidth>
                        <InputLabel required>Tipo de pago</InputLabel>
                        <Select {...field} MenuProps={{ disablePortal: true, keepMounted: false }}>
                          <MenuItem value="QUINCENAL">Quincenal</MenuItem>
                          <MenuItem value="MENSUAL">Mensual</MenuItem>
                        </Select>
                        {errors.typePayment ? <FormHelperText>{errors.typePayment.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </MuiGrid>

                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="datePayment"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.datePayment)} fullWidth>
                        <InputLabel required>Fecha de pago</InputLabel>
                        <Select {...field} MenuProps={{ disablePortal: true, keepMounted: false }}>
                          <MenuItem value="15-30">15 - 30</MenuItem>
                          <MenuItem value="5-20">5 - 20</MenuItem>
                          <MenuItem value="10-25">10 - 25</MenuItem>
                        </Select>
                        {errors.datePayment ? <FormHelperText>{errors.datePayment.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </MuiGrid>

                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="selectedDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.selectedDate)} fullWidth>
                        <InputLabel required>Día a pagar</InputLabel>
                        <DatePicker
                          {...field}
                          minDate={dayjs()}
                          sx={{ marginTop: "0.5rem" }}
                          slotProps={{ popper: { disablePortal: true } }}
                        />
                        {errors.selectedDate ? <FormHelperText>{errors.selectedDate.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </MuiGrid>

                {/* Agente */}
                <MuiGrid item md={6} xs={12}>
                  <Controller
                    control={control}
                    name="selectedAgent"
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.selectedAgent)}
                        disabled={user.role === ROLES.AGENTE}
                      >
                        <InputLabel required>Agente</InputLabel>
                        <Select {...field} MenuProps={{ disablePortal: true, keepMounted: false }}>
                          {user.role === ROLES.AGENTE ? (
                            <MenuItem value={String(user.id)}>{user.name || "Yo"}</MenuItem>
                          ) : (
                            agentsOptions.map((option) => (
                              <MenuItem key={option.id} value={String(option.id)}>
                                {option.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.selectedAgent ? <FormHelperText>{errors.selectedAgent.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </MuiGrid>
              </MuiGrid>
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list}>
              Cancelar
            </Button>

            {createdClientId ? (
              <Tooltip title="Guardar solicitud" disablePortal>
                <span>
                  <Button variant="contained" type="submit" disabled={solicitudDisabled} aria-disabled={solicitudDisabled}>
                    Guardar
                  </Button>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Primero guarda el cliente para habilitar la solicitud" disablePortal disableInteractive>
                <span>
                  <Button variant="contained" disabled aria-disabled>
                    Guardar
                  </Button>
                </span>
              </Tooltip>
            )}
          </CardActions>
        </Card>
      </Stack>

      {/* Snackbar no bloqueante */}
      <Snackbar
        open={popoverAlert.open}
        autoHideDuration={3500}
        onClose={popoverAlert.handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={popoverAlert.handleClose}
          severity={alertSeverity || "info"}
          sx={{ width: "100%" }}
        >
          {alertMsg || "Operación completada."}
        </MuiAlert>
      </Snackbar>
    </form>
  );
}
