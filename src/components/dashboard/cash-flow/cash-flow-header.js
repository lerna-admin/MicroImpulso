"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createCashMovement } from "@/app/dashboard/cash_flow/hooks/use-cash-flow";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
	Building as BuildingIcon,
	Plus as PlusIcon,
	TrendDown as TrendDownIcon,
	TrendUp as TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr";

import { usePopover } from "@/hooks/use-popover";

export function CashFlowHeader({ branch }) {
	const popover = usePopover();
	const router = useRouter();
	const [amount, setAmount] = React.useState(0);
	const [typeMovement, setTypeMovement] = React.useState("");
	const [category, setCategory] = React.useState("");
	const [description, setDescription] = React.useState("");

	const handleRenewLoanRequest = async () => {
		popover.handleClose();

		await createCashMovement({
			typeMovement: typeMovement,
			amount: amount,
			category: category,
			description: description,
		}); // TODO hacer que si la respuesta es correcta muestre un alert exitoso o error.

		router.refresh();
	};

	return (
		<React.Fragment>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "center" }}>
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Movimientos de caja</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box padding={1} paddingRight={0}>
						<BuildingIcon />
					</Box>
					<Typography padding={1} variant="body2" >
						{`Sede ${branch}`}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<Button color="secondary" startIcon={<PlusIcon />} variant="contained" onClick={popover.handleOpen}>
						Registrar movimiento
					</Button>
				</Box>
			</Stack>

			{/* Modal para renovar solicitud */}
			<Dialog
				fullWidth
				maxWidth={"sm"}
				open={popover.open}
				onClose={popover.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"}>
					{"Añadir nuevo movimiento"}
				</DialogTitle>

				<DialogContent>
					<Stack spacing={4} sx={{ p: 3 }}>
						<Grid container spacing={3}>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
							>
								<InputLabel id="type-movement">Tipo de movimiento</InputLabel>
								<Select
									fullWidth
									labelId="type-movement"
									value={typeMovement}
									onChange={(e) => setTypeMovement(e.target.value)}
								>
									{/* TODO HACER QUE CUANDO SELECCIONE UN TIPO DE MOVIMIENTO SOLO MUESTRE LO CORRESPONDIDO, ES DECIR NO 
									MOSTRAR EN UNA ENTRADA DE DINERO NO PUEDO ELEGIR UN GASTO */}
									<MenuItem value="ENTRADA">
										<Stack direction="row" alignItems="center" spacing={1}>
											<TrendUpIcon color="var(--mui-palette-success-main)" fontSize="var(--icon-fontSize-md)" />
											<Typography>Entrada</Typography>
										</Stack>
									</MenuItem>
									<MenuItem value="SALIDA">
										<Stack direction="row" alignItems="center" spacing={1}>
											<TrendDownIcon color="var(--mui-palette-error-main)" fontSize="var(--icon-fontSize-md)" />
											<Typography>Salida</Typography>
										</Stack>
									</MenuItem>
								</Select>
							</Grid>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
							>
								<TextField
									label="Monto"
									variant="outlined"
									slotProps={{ htmlInput: { min: 0 } }}
									value={amount.toLocaleString("es-CO")}
									onChange={(e) => {
										const parsed = parseCurrency(e.target.value);
										setAmount(parsed);
									}}
									fullWidth
								/>
							</Grid>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
							>
								<InputLabel id="category">Categoria</InputLabel>
								<Select fullWidth labelId="category" value={category} onChange={(e) => setCategory(e.target.value)}>
									<MenuItem value="COBRO_CLIENTE">Cobro</MenuItem>
									<MenuItem value="PRESTAMO">Prestamos</MenuItem>
									<MenuItem value="GASTO_PROVEEDOR">Gastos</MenuItem>
									<MenuItem value="ENTRADA_GERENCIA">Entrada caja</MenuItem>
								</Select>
							</Grid>
							<Grid
								size={{
									md: 12,
									xs: 12,
								}}
							>
								<TextField
									label="Descripción"
									placeholder="Escribe una descripción..."
									multiline
									minRows={3}
									fullWidth
									required
									value={description}
									slotProps={{ htmlInput: { maxLength: 150 } }}
									onChange={(e) => {
										setDescription(e.target.value);
									}}
								/>
							</Grid>
						</Grid>
					</Stack>
				</DialogContent>
				<DialogActions sx={{ padding: 3 }}>
					<Button variant="contained" onClick={handleRenewLoanRequest} autoFocus>
						Aceptar
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							popover.handleClose();
							popover.handleClose();
						}}
					>
						Cancelar
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

const parseCurrency = (value) => {
	// Elimina cualquier carácter que no sea número
	return Number(value.replaceAll(/[^0-9]/g, ""));
};
