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
import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function CustomerEditForm({ customerToEdit, onlyRead = false }) {
  const [formData, setFormData] = React.useState({
    id: "",              // 👈 id del CLIENTE
    name: "",
    phone: "",
    email: "",
    document: "",
    address: "",
    totalLoanAmount: 0,  // numérico
    status: "",
    createdAt: "",
    updatedAt: "",
  });

  const popover = usePopover();
  const router = useRouter();

  // Cargar datos desde customerToEdit
  React.useEffect(() => {
    if (!customerToEdit) return;

    const c = customerToEdit.client ?? {};
    setFormData({
      id: c.id ?? customerToEdit.id ?? "",                 // 👈 toma id del cliente
      name: c.name ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      document: c.document ?? "",
      address: c.address ?? "",
      totalLoanAmount:
        Number(customerToEdit.montoPrestado ?? customerToEdit.totalLoanAmount ?? 0),
      status: c.status ?? customerToEdit.status ?? "",
      createdAt: customerToEdit.createdAt ?? "",
      updatedAt: customerToEdit.updatedAt ?? "",
    });
  }, [customerToEdit]);

  // onChange genérico para inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // (Si algún día quisieras editar fechas)
  const handleChangeCreatedAt = (v: any) => {
    setFormData((prev) => ({ ...prev, createdAt: v?.toISOString?.() ?? prev.createdAt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación mínima
    if (!formData.id) {
      popover.handleOpen();
      console.error("Falta id del cliente");
      return;
    }

    // Arma payload que espera tu API
    const payload = {
      id: formData.id,
      name: formData.name?.trim(),
      phone: formData.phone?.trim(),
      email: formData.email?.trim(),
      document: formData.document?.trim(),
      address: formData.address?.trim(),
      // Si tu endpoint espera otros nombres, mapéalos aquí
    };

    const response = await updateCustomer(payload);
    if (response?.status === 200) {
      popover.handleOpen();
      setTimeout(() => {
        router.push(paths.dashboard.customers.list);
      }, 1500);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Campo oculto para garantizar que el id viaje en el submit */}
        <input type="hidden" name="id" value={formData.id} />

        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={3}>
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

            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Celular</InputLabel>
                <OutlinedInput
                  disabled={onlyRead}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  label="Celular"
                />
              </FormControl>
            </Grid>

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

            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Monto Prestado</InputLabel>
                <OutlinedInput
                  disabled
                  id="totalLoanAmount"
                  name="totalLoanAmount"
                  value={new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(formData.totalLoanAmount ?? 0)}
                  label="Monto Prestado"
                />
              </FormControl>
            </Grid>

            <Grid size={{ md: 6, xs: 12 }}>
              <FormControl fullWidth>
                <DatePicker
                  disabled
                  name="createdAt"
                  format="MMM D, YYYY hh:mm A"
                  label="Fecha de creación"
                  value={formData.createdAt ? dayjs(formData.createdAt) : null}
                  onChange={handleChangeCreatedAt}
                />
              </FormControl>
            </Grid>
          </Grid>

          {onlyRead ? null : (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "flex-end" }}>
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
