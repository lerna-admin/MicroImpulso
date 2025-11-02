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
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

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

/** Detecta país y retorna {iso2, local} a partir de "57XXXXXXXX" o "506XXXXXXX" */
function parseStoredPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return { iso2: "CO", local: "" }; // por defecto CO
  
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

/** Normaliza enlaces: si no trae protocolo, antepone https:// */
function normalizeLink(val) {
  const s = String(val || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

/** Valida y normaliza un custom field según su tipo */
function sanitizeCustomField(cf) {
  const key = String(cf.key || "").trim();
  if (!key) return null;
  
  const type = cf.type === "number" || cf.type === "link" ? cf.type : "text";
  let value = cf.value;
  
  if (type === "number") {
    const num = Number(value);
    if (Number.isFinite(num)) value = num;
    else return null; // descarta si no es número válido
  } else if (type === "link") {
    const url = normalizeLink(value);
    try {
      new URL(url);
      value = url;
    } catch {
      return null; // enlace inválido -> descarta
    }
  } else {
    value = String(value ?? "").trim();
  }
  
  return { key, type, value };
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
    // control de teléfono
    countryIso2: "CO",
    localPhone: "",
  });
  
  // custom fields locales (siempre array)
  const [customFields, setCustomFields] = React.useState([]);
  
  // errores simples para custom fields
  const [cfErrors, setCfErrors] = React.useState({}); // {index: {key?: string, value?: string}}
  
  const popover = usePopover();
  const router = useRouter();
  
  // Cargar datos desde customerToEdit
  React.useEffect(() => {
    if (!customerToEdit) return;
    
    // Soporta estructuras { client: {...} } o el objeto plano
    const c = customerToEdit.client ?? customerToEdit ?? {};
    const id = c.id ?? customerToEdit.id ?? "";
    
    const parsed = parseStoredPhone(c.phone);
    
    // customFields deben ser un array
    const initialCF = Array.isArray(c.customFields) ? c.customFields : [];
    
    setFormData({
      id,
      name: c.name ?? "",
      email: c.email ?? "",
      document: c.document ?? "",
      address: c.address ?? "",
      status: c.status ?? customerToEdit.status ?? "",
      createdAt: customerToEdit.createdAt ?? c.createdAt ?? "",
      updatedAt: customerToEdit.updatedAt ?? c.updatedAt ?? "",
      countryIso2: parsed.iso2,
      localPhone: parsed.local,
    });
    
    setCustomFields(
      initialCF.map((f) => ({
        key: String(f.key ?? "").trim(),
        type: f.type === "number" || f.type === "link" ? f.type : "text",
        value: f.value ?? "",
      }))
    );
    setCfErrors({});
  }, [customerToEdit]);
  
  // onChange genérico
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // handlers de custom fields
  const addCustomField = () => {
    setCustomFields((prev) => [...prev, { key: "", type: "text", value: "" }]);
  };
  
  const removeCustomField = (index) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
    setCfErrors((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };
  
  const updateCustomField = (index, patch) => {
    setCustomFields((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
  );
  // limpia error al editar
  setCfErrors((prev) => ({ ...prev, [index]: {} }));
};

const validateCustomFields = () => {
  const errs = {};
  customFields.forEach((cf, i) => {
    const e = {};
    const key = String(cf.key || "").trim();
    if (!key) e.key = "La clave es obligatoria";
    
    if (cf.type === "number") {
      const num = Number(cf.value);
      if (!Number.isFinite(num)) e.value = "Debe ser un número válido";
    } else if (cf.type === "link") {
      const url = normalizeLink(cf.value);
      try {
        new URL(url);
      } catch {
        e.value = "Enlace inválido";
      }
    }
    if (Object.keys(e).length) errs[i] = e;
  });
  setCfErrors(errs);
  return Object.keys(errs).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.id) {
    popover.handleOpen();
    console.error("Falta id del cliente");
    return;
  }
  
  // valida CFs
  if (!validateCustomFields()) {
    popover.handleOpen();
    return;
  }
  
  // recomponer phone para API
  const phone = composePhone(formData.countryIso2, formData.localPhone);
  
  // normalizar CFs y descartar vacíos/incorrectos
  const sanitizedCFs = customFields.map(sanitizeCustomField).filter(Boolean);
  
  const payload = {
    id: formData.id,
    name: (formData.name || "").trim(),
    phone,
    email: (formData.email || "").trim(),
    document: (formData.document || "").trim(),
    address: (formData.address || "").trim(),
    // 👇 incluimos customFields al update
    customFields: sanitizedCFs,
  };
  
  try {
    const response = await updateCustomer(payload, payload.id);
    if (response?.status === 200) {
      popover.handleOpen();
      // revalidar datos sin navegar
      router.refresh();
    } else {
      popover.handleOpen();
      console.error("Error al actualizar", response);
    }
  } catch (err) {
    popover.handleOpen();
    console.error("Error al actualizar", err);
  }
};

const currentCountry = COUNTRIES.find((c) => c.iso2 === formData.countryIso2);

return (
  <>
  <form onSubmit={handleSubmit}>
  <input type="hidden" name="id" value={formData.id} />
  
  <Stack spacing={3} sx={{ p: 0 }}>
  {/* =================== Datos básicos =================== */}
  <Card variant="outlined">
  <CardContent>
  <Typography variant="h6" gutterBottom>
  Datos del cliente
  </Typography>
  <Grid container spacing={3}>
  {/* País (indicativo del celular) */}
  <Grid size={{ md: 6, xs: 12 }}>
  <FormControl fullWidth disabled={onlyRead}>
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
  
  {/* Documento */}
  <Grid size={{ md: 6, xs: 12 }}>
  <FormControl fullWidth disabled={onlyRead}>
  <InputLabel>N. de documento</InputLabel>
  <OutlinedInput
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
  <FormControl fullWidth disabled={onlyRead}>
  <InputLabel>Nombre Completo</InputLabel>
  <OutlinedInput
  id="name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  label="Nombre Completo"
  />
  </FormControl>
  </Grid>
  
  {/* Celular (local + indicativo visible) */}
  <Grid size={{ md: 6, xs: 12 }}>
  <FormControl fullWidth disabled={onlyRead}>
  <InputLabel>Celular</InputLabel>
  <OutlinedInput
  id="localPhone"
  name="localPhone"
  value={formData.localPhone}
  onChange={(e) =>
    setFormData((p) => ({
      ...p,
      localPhone: e.target.value.replace(/\D/g, ""),
    }))
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
  <FormControl fullWidth disabled={onlyRead}>
  <InputLabel>Correo</InputLabel>
  <OutlinedInput
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
  <FormControl fullWidth disabled={onlyRead}>
  <InputLabel>Dirección</InputLabel>
  <OutlinedInput
  id="address"
  name="address"
  value={formData.address}
  onChange={handleChange}
  label="Dirección"
  />
  </FormControl>
  </Grid>
  </Grid>
  </CardContent>
  </Card>
  
  {/* =================== Custom Fields =================== */}
  <Card variant="outlined">
  <CardContent>
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
  <Typography variant="h6">Campos personalizados</Typography>
  {!onlyRead && (
    <Tooltip title="Agregar campo">
    <Button onClick={addCustomField} size="small" variant="outlined">
    + Agregar campo
    </Button>
    </Tooltip>
  )}
  </Box>
  <Divider sx={{ mb: 2 }} />
  
  {customFields.length === 0 ? (
    <Typography variant="body2" sx={{ opacity: 0.7 }}>
    No hay campos personalizados.
    </Typography>
  ) : (
    <Stack spacing={2}>
    {customFields.map((cf, idx) => {
      const err = cfErrors[idx] || {};
      const canOpen = cf.type === "link";
      const openHref = canOpen ? normalizeLink(cf.value) : undefined;
      
      return (
        <Grid container spacing={2} key={`cf-${idx}`} alignItems="center">
        {/* Clave */}
        <Grid size={{ md: 4, xs: 12 }}>
        <FormControl fullWidth error={Boolean(err.key)} disabled={onlyRead}>
        <InputLabel>Nombre del campo</InputLabel>
        <OutlinedInput
        value={cf.key}
        onChange={(e) => updateCustomField(idx, { key: e.target.value })}
        label="Nombre del campo"
        placeholder="p.ej. Facebook, Ingresos, Observaciones"
        />
        {err.key ? <FormHelperText>{err.key}</FormHelperText> : null}
        </FormControl>
        </Grid>
        
        {/* Tipo */}
        <Grid size={{ md: 3, xs: 12 }}>
        <FormControl fullWidth disabled={onlyRead}>
        <InputLabel>Tipo</InputLabel>
        <Select
        label="Tipo"
        value={cf.type}
        onChange={(e) => updateCustomField(idx, { type: e.target.value })}
        >
        <MenuItem value="text">Texto</MenuItem>
        <MenuItem value="number">Número</MenuItem>
        <MenuItem value="link">Enlace</MenuItem>
        </Select>
        </FormControl>
        </Grid>
        
        {/* Valor */}
        <Grid size={{ md: 3, xs: 12 }}>
        <FormControl fullWidth error={Boolean(err.value)} disabled={onlyRead}>
        <InputLabel>
        {cf.type === "number" ? "Valor numérico" : cf.type === "link" ? "URL" : "Valor"}
        </InputLabel>
        <OutlinedInput
        value={cf.value}
        onChange={(e) => {
          let v = e.target.value;
          if (cf.type === "number") v = v.replace(/[^0-9.\-]/g, "");
          updateCustomField(idx, { value: v });
        }}
        label={cf.type === "number" ? "Valor numérico" : cf.type === "link" ? "URL" : "Valor"}
        placeholder={cf.type === "link" ? "https://ejemplo.com" : ""}
        />
        {err.value ? <FormHelperText>{err.value}</FormHelperText> : null}
        </FormControl>
        </Grid>
        
        {/* Acciones: Abrir (para link) + Eliminar */}
        <Grid
        size={{ md: 2, xs: 12 }}
        sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1 }}
        >
        {cf.type === "link" && (
          <Tooltip title={canOpen ? "Abrir en nueva pestaña" : "URL inválida"}>
          <span>
          <Button
          size="small"
          variant="outlined"
          component="a"
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          disabled={!canOpen}
          >
          Abrir
          </Button>
          </span>
          </Tooltip>
        )}
        
        {!onlyRead && (
          <Tooltip title="Eliminar">
          <Button
          onClick={() => removeCustomField(idx)}
          size="small"
          color="error"
          variant="outlined"
          >
          Eliminar
          </Button>
          </Tooltip>
        )}
        </Grid>
        </Grid>
      );
    })}
    
    </Stack>
  )}
  </CardContent>
  
  {!onlyRead && (
    <CardActions sx={{ justifyContent: "flex-end" }}>
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
    </CardActions>
  )}
  </Card>
  </Stack>
  </form>
  
  <NotificationAlert openAlert={popover.open} onClose={popover.handleClose} msg={"Perfil actualizado!"} />
  </>
);
}
