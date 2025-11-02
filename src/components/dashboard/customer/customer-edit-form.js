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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import { paths } from "@/paths";
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

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
    return String.fromCodePoint(
      A + (cc.charCodeAt(0) - 65),
      A + (cc.charCodeAt(1) - 65)
    );
  } catch {
    return "🌐";
  }
}

/** Dado un phone almacenado como "57XXXXXXXXXX" o "506XXXXXXXX", detecta país y retorna {iso2, local} */
function parseStoredPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return { iso2: "CO", local: "" }; // por defecto CO

  // buscar el país cuyo indicativo sea prefijo del número
  const match = COUNTRIES
    .slice()
    .sort((a, b) => b.phoneCode.length - a.phoneCode.length) // prefijo más largo primero
    .find((c) => digits.startsWith(c.phoneCode));

  if (!match) return { iso2: "CO", local: digits }; // fallback
  return { iso2: match.iso2, local: digits.slice(match.phoneCode.length) };
}

/** compone número para el backend = <indicativo><local> (sin '+') */
function composePhone(iso2, local) {
  const c = COUNTRIES.find((x) => x.iso2 === iso2);
  const localDigits = String(local || "").replace(/\D/g, "");
  return (c ? c.phoneCode : "") + localDigits;
}

export function CustomerEditForm({ customerToEdit, onlyRead = false }) {
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    email: "",
    document: "",
    address: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    // nuevos controlados de teléfono
    countryIso2: "CO",
    localPhone: "",
  });

  const popover = usePopover();
  const router = useRouter();

  // Cargar datos desde customerToEdit
  React.useEffect(() => {
    if (!customerToEdit) return;

    const c = customerToEdit.client ?? {};
    const id = c.id ?? customerToEdit.id ?? "";

    // Derivar país y número local desde el phone guardado
    const parsed = parseStoredPhone(c.phone);

    setFormData({
      id,
      name: c.name ?? "",
      email: c.email ?? "",
      document: c.document ?? "",
      address: c.address ?? "",
      status: c.status ?? customerToEdit.status ?? "",
      createdAt: customerToEdit.createdAt ?? "",
      updatedAt: customerToEdit.updatedAt ?? "",
      countryIso2: parsed.iso2,
      localPhone: parsed.local,
    });
  }, [customerToEdit]);

  // onChange genérico
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) {
      popover.handleOpen();
      console.error("Falta id del cliente");
      return;
    }

    // re-componer phone para API
    const phone = composePhone(formData.countryIso2, formData.localPhone);

    const payload = {
      id: formData.id,
      name: (formData.name || "").trim(),
      phone, // <-- combinado con indicativo del país
      email: (formData.email || "").trim(),
      document: (formData.document || "").trim(),
      address: (formData.address || "").trim(),
    };

    const response = await updateCustomer(payload, payload.id);
    if (response?.status === 200) {
      popover.handleOpen();
      // Mantenerse en la misma página y revalidar datos
      router.refresh();
    }
  };

  const currentCountry = COUNTRIES.find((c) => c.iso2 === formData.countryIso2);

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Campo oculto: garantiza que el id viaje */}
        <input type="hidden" name="id" value={formData.id} />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* País (afecta al indicativo de celular) */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>País</InputLabel>
                <Select
                  label="País"
                  name="countryIso2"
                  value={formData.countryIso2}
                  onChange={handleChange}
                  renderValue={(v) => {
                    const c = COUNTRIES.find((x) => x.iso2 === v);
                    return (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span style={{ fontSize: 18 }}>{flagFromCountryCode(v)}</span>
                        <span>{c ? `${c.name} (+${c.phoneCode})` : v}</span>
                      </Box>
                    );
                  }}
                  disabled={onlyRead}
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
              </FormControl>
            </Grid>

            {/* N. de documento */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>N. de documento</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  label="N. de documento"
                />
              </FormControl>
            </Grid>

            {/* Nombre */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Nombre Completo</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  label="Nombre Completo"
                />
              </FormControl>
            </Grid>

            {/* Celular (solo local) con indicativo visible */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Celular</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="localPhone"
                  name="localPhone"
                  value={formData.localPhone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, localPhone: e.target.value.replace(/\D/g, "") }))
                  }
                  startAdornment={
                    <Chip
                      size="small"
                      label={currentCountry ? `+${currentCountry.phoneCode}` : "+??"}
                      sx={{ mr: 1 }}
                    />
                  }
                  inputProps={{ inputMode: "numeric" }}
                  label="Celular"
                />
              </FormControl>
            </Grid>

            {/* Correo */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Correo</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Correo"
                />
              </FormControl>
            </Grid>

            {/* Dirección */}
            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Dirección</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  label="Dirección"
                />
              </FormControl>
            </Grid>
          </Grid>

          {onlyRead ? null : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "flex-end" }}
            >
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => router.push(paths.dashboard.customers.list)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Confirmar
              </Button>
            </Stack>
          )}
        </Stack>
      </form>

      <NotificationAlert
        openAlert={popover.open}
        onClose={popover.handleClose}
        msg={"Perfil actualizado!"}
      />
    </>
  );
}
