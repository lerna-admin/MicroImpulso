"use client";

import * as React from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/app/dashboard/customers/hooks/use-customers";
import { createRequest } from "@/app/dashboard/requests/hooks/use-requests";
import { ROLES } from "@/constants/roles";
import { deleteAlphabeticals, formatCurrency } from "@/helpers/format-currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { MenuItem, Typography, Chip, Box } from "@mui/material";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { logger } from "@/lib/default-logger";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

/* ====== Países soportados (extiende esta lista cuando quieras) ====== */
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

  // ========== Validación ==========
  const schema = zod
    .object({
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
      email: zod
        .string()
        .email("Debe ser un correo válido")
        .min(5, "El correo es obligatorio")
        .max(255, "El correo es muy largo"),

      localPhone: zod
        .string()
        .min(7, "El celular es obligatorio")
        .max(10, "El celular es muy largo")
        .regex(/^\d+$/, { message: "El celular debe contener solo números" }),

      localPhone2: zod
        .string()
        .optional()
        .refine((val) => !val || (/^\d+$/.test(val) && val.length >= 7 && val.length <= 10), {
          message: "El celular 2 debe ser numérico (7 a 10 dígitos)",
        }),

      documentType: zod.enum(["CC", "CE", "TE"], {
        errorMap: () => ({ message: "Debes elegir un tipo de documento" }),
      }),
      document: zod
        .string()
        .min(5, { message: "El documento es obligatorio" })
        .max(20, { message: "El documento es muy largo" })
        .regex(/^[A-Za-z0-9]+$/, {
          message: "El documento solo puede tener letras y números (sin espacios)",
        }),
      address: zod.string().min(5, { message: "La dirección es obligatoria" }).max(255),
      address2: zod.string().max(255).optional(),

      amount: zod
        .number({ invalid_type_error: "El monto debe ser un número" })
        .min(1, { message: "El monto es obligatorio" })
        .min(50_000, { message: "El monto debe superar los $50.000" })
        .max(5_000_000, { message: "El monto no puede superar los 5.000.000" }),
      typePayment: zod.enum(["QUINCENAL", "MENSUAL"], {
        errorMap: () => ({ message: "Debes elegir un tipo de pago" }),
      }),
      datePayment: zod.enum(["15-30", "5-20", "10-25"], {
        errorMap: () => ({ message: "Debes elegir una fecha de pago" }),
      }),
      selectedDate: zod
        .custom((val) => dayjs.isDayjs(val) && val.isValid(), {
          message: "La fecha es obligatoria",
        })
        .refine((val) => dayjs(val).isAfter(dayjs(), "day"), {
          message: "La fecha debe ser posterior a hoy",
        }),
      selectedAgent: zod.string().optional(),

      referenceName: zod
        .string()
        .min(3, { message: "El nombre de la referencia es obligatorio" })
        .max(100, { message: "Máximo 100 caracteres" })
        .regex(/^[A-Za-zÀ-ÿ\u00F1\u00D1]+(?: [A-Za-zÀ-ÿ\u00F1\u00D1]+)+$/, {
          message: "Debe ingresar nombre y apellido, solo letras y espacios",
        }),
      referencePhone: zod
        .string()
        .min(7, { message: "El celular de la referencia es obligatorio" })
        .max(10, { message: "El celular es muy largo" })
        .regex(/^\d+$/, { message: "El celular debe contener solo números" }),
      referenceRelationship: zod
        .string()
        .min(3, { message: "El parentesco es obligatorio" })
        .max(50, { message: "Máximo 50 caracteres" }),
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
    setValue,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const countryIso2 = watch("countryIso2");

  const [alertMsg, setAlertMsg] = React.useState("");
  theAlertSeverity = React.useState("success")[0]; // avoid unused var warning in some setups
  const [alertSeverity, setAlertSeverity] = React.useState("success");

  // ====== carga de agentes por país ======
  const fetchAgentsByCountry = React.useCallback(async (iso2) => {
    try {
      const res = await fetch(`/api/branches?countryIso2=${encodeURIComponent(iso2)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const branches = await res.json();

      const allAgents = (branches || [])
        .flatMap((b) => (Array.isArray(b.agents) ? b.agents : []))
        .filter((a) => a && a.role === ROLES.AGENTE);

      // dedupe
      const uniqMap = new Map(allAgents.map((a) => [a.id, a]));
      setAgentsOptions(Array.from(uniqMap.values()));
    } catch (error) {
      setAlertMsg(error?.message || "No fue posible cargar agentes");
      setAlertSeverity("error");
      popoverAlert.handleOpen();
      setAgentsOptions([]);
    }
  }, [popoverAlert]);

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
    return (c ? c.phoneCode : "") + localDigits;
  }

  const onSubmit = React.useCallback(
    async (dataForm) => {
      try {
        const agentId = user.role === ROLES.AGENTE ? user.id : dataForm.selectedAgent;

        const phone = composePhone(dataForm.countryIso2, dataForm.localPhone);
        const phone2 = dataForm.localPhone2 ? composePhone(dataForm.countryIso2, dataForm.localPhone2) : null;

        const bodyCustomer = {
          name: dataForm.name,
          email: dataForm.email,
          phone,
          phone2,
          documentType: dataForm.documentType,
          document: dataForm.document,
          address: dataForm.address,
          address2: dataForm.address2 || null,
          referenceName: dataForm.referenceName,
          referencePhone: dataForm.referencePhone,
          referenceRelationship: dataForm.referenceRelationship,
          status: "PROSPECT",
        };

        const created = await createCustomer(bodyCustomer);
        const newClientId = created && created.id;

        const bodyRequest = {
          client: newClientId,
          agent: agentId,
          status: "new",
          requestedAmount: dataForm.amount,
          endDateAt: dataForm.selectedDate,
          amount: dataForm.amount * 1.2,
          paymentDay: dataForm.datePayment,
          type: dataForm.typePayment,
        };
        await createRequest(bodyRequest);

        setAlertMsg("¡Creado exitosamente!");
        setAlertSeverity("success");
      } catch (error) {
        setAlertMsg(error?.message || "Error al crear");
        setAlertSeverity("error");
        logger.error(error);
      } finally {
        popoverAlert.handleOpen();
        reset({ ...defaultValues, countryIso2 });
      }
    },
    [reset, popoverAlert, countryIso2, user]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* ==================== DATOS DEL CLIENTE ==================== */}
        <Card>
          <CardContent>
            <Typography variant="h5" paddingTop={3}>
              Crear cliente
            </Typography>

            <Stack spacing={3} paddingTop={3}>
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
                        {errors.countryIso2 ? (
                          <FormHelperText>{errors.countryIso2.message}</FormHelperText>
                        ) : null}
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

                {/* Celular local (sin indicativo) */}
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
                            startAdornment={
                              <Chip
                                label={c ? `+${c.phoneCode}` : "+??"}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            }
                            inputProps={{ inputMode: "numeric" }}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                          />
                          {errors.localPhone ? (
                            <FormHelperText>{errors.localPhone.message}</FormHelperText>
                          ) : null}
                        </FormControl>
                      );
                    }}
                  />
                </Grid>

                {/* Celular local 2 (opcional) */}
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
                            startAdornment={
                              <Chip
                                label={c ? `+${c.phoneCode}` : "+??"}
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            }
                            inputProps={{ inputMode: "numeric" }}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                          />
                          {errors.localPhone2 ? (
                            <FormHelperText>{errors.localPhone2.message}</FormHelperText>
                          ) : null}
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
                        {errors.documentType ? (
                          <FormHelperText>{errors.documentType.message}</FormHelperText>
                        ) : null}
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
                        {errors.document ? (
                          <FormHelperText>{errors.document.message}</FormHelperText>
                        ) : null}
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

                {/* Dirección 2 opcional */}
                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="address2"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.address2)} fullWidth>
                        <InputLabel>Dirección 2 (opcional)</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.address2 ? (
                          <FormHelperText>{errors.address2.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
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
              <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="referenceName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.referenceName)} fullWidth>
                        <InputLabel required>Nombre completo de la referencia</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.referenceName ? (
                          <FormHelperText>{errors.referenceName.message}</FormHelperText>
                        ) : null}
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
                        {errors.referenceRelationship ? (
                          <FormHelperText>{errors.referenceRelationship.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="referencePhone"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.referencePhone)} fullWidth>
                        <InputLabel required>Teléfono de la referencia</InputLabel>
                        <OutlinedInput
                          {...field}
                          inputProps={{ inputMode: "numeric" }}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                        />
                        {errors.referencePhone ? (
                          <FormHelperText>{errors.referencePhone.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* ==================== SOLICITUD ==================== */}
        <Card>
          <CardContent>
            <Typography variant="h5" paddingTop={3}>
              Crear solicitud
            </Typography>

            <Stack spacing={3} paddingTop={3}>
              <Grid container spacing={3}>
                <Grid size={{ md: 6, xs: 12 }}>
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
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="typePayment"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.typePayment)} fullWidth>
                        <InputLabel required>Tipo de pago</InputLabel>
                        <Select {...field}>
                          <MenuItem value="QUINCENAL">Quincenal</MenuItem>
                          <MenuItem value="MENSUAL">Mensual</MenuItem>
                        </Select>
                        {errors.typePayment ? (
                          <FormHelperText>{errors.typePayment.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="datePayment"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.datePayment)} fullWidth>
                        <InputLabel required>Fecha de pago</InputLabel>
                        <Select {...field}>
                          <MenuItem value="15-30">15 - 30</MenuItem>
                          <MenuItem value="5-20">5 - 20</MenuItem>
                          <MenuItem value="10-25">10 - 25</MenuItem>
                        </Select>
                        {errors.datePayment ? (
                          <FormHelperText>{errors.datePayment.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ md: 6, xs: 12 }}>
                  <Controller
                    control={control}
                    name="selectedDate"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.selectedDate)} fullWidth>
                        <InputLabel required>Día a pagar</InputLabel>
                        <DatePicker {...field} minDate={dayjs()} sx={{ marginTop: "0.5rem" }} />
                        {errors.selectedDate ? (
                          <FormHelperText>{errors.selectedDate.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                {/* Agente */}
                <Grid size={{ md: 6, xs: 12 }}>
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
                        <Select {...field}>
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
                        {errors.selectedAgent ? (
                          <FormHelperText>{errors.selectedAgent.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="outlined" component={RouterLink} href={paths.dashboard.customers.list}>
              Cancelar
            </Button>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <NotificationAlert
        openAlert={popoverAlert.open}
        onClose={popoverAlert.handleClose}
        msg={alertMsg}
        severity={alertSeverity}
      />
    </form>
  );
}
