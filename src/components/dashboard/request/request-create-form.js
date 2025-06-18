"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PencilSimple as PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react/dist/ssr/PlusCircle";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { dayjs } from "@/lib/dayjs";
import { logger } from "@/lib/default-logger";
import { DataTable } from "@/components/core/data-table";
import { Option } from "@/components/core/option";
import { toast } from "@/components/core/toaster";

function calculateSubtotal(lineItems) {
	const subtotal = lineItems.reduce((acc, lineItem) => acc + lineItem.quantity * lineItem.unitPrice, 0);
	return Number.parseFloat(subtotal.toFixed(2));
}

function calculateTotalWithoutTaxes(subtotal, discount, shippingRate) {
	return subtotal - discount + shippingRate;
}

function calculateTax(totalWithoutTax, taxRate) {
	const tax = totalWithoutTax * (taxRate / 100);
	return Number.parseFloat(tax.toFixed(2));
}

function calculateTotal(totalWithoutTax, taxes) {
	return totalWithoutTax + taxes;
}

// You could memoize this function to avoid re-creating the columns on every render.
function getLineItemColumns({ onEdit }) {
	return [
		{
			formatter: (row) => {
				return (
					<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
						<Box
							sx={{
								backgroundImage: `url(${row.image})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								bgcolor: "var(--mui-palette-background-level2)",
								borderRadius: 1,
								flex: "0 0 auto",
								height: "40px",
								width: "40px",
							}}
						/>
						<Typography variant="subtitle2">{row.product}</Typography>
					</Stack>
				);
			},
			name: "Product",
			width: "220px",
		},
		{
			formatter: (row) => (
				<Typography variant="inherit">{new Intl.NumberFormat("en-US").format(row.quantity)}</Typography>
			),
			name: "Quantity",
			width: "100px",
		},
		{
			formatter: (row) => (
				<Typography variant="inherit">
					{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.unitPrice)}
				</Typography>
			),
			name: "Unit Price",
			width: "100px",
		},
		{
			formatter: (row) => (
				<IconButton
					onClick={() => {
						onEdit?.(row.id);
					}}
				>
					<PencilSimpleIcon />
				</IconButton>
			),
			name: "Actions",
			hideName: true,
			width: "100px",
			align: "right",
		},
	];
}

const schema = zod.object({
	number: zod.string().max(255),
	issueDate: zod.date(),
	customer: zod.string().min(1, "Customer is required").max(255),
	billingAddress: zod.object({
		country: zod.string().min(1, "Country is required").max(255),
		state: zod.string().min(1, "State is required").max(255),
		city: zod.string().min(1, "City is required").max(255),
		zipCode: zod.string().min(1, "Zip code is required").max(255),
		line1: zod.string().min(1, "Street line 1 is required").max(255),
		line2: zod.string().max(255).optional(),
	}),
	taxId: zod.string().max(255).optional(),
	deliveryNotes: zod.string().max(255).optional(),
	lineItems: zod.array(
		zod.object({
			id: zod.string(),
			product: zod.string().max(255),
			image: zod.string(),
			quantity: zod.number().min(1, "Quantity must be greater than or equal to 1"),
			unitPrice: zod.number().min(0, "Unit price must be greater than or equal to 0"),
		})
	),
	discount: zod
		.number()
		.min(0, "Discount must be greater than or equal to 0")
		.max(100, "Discount must be less than or equal to 100"),
	shippingRate: zod.number().min(0, "Shipping rate must be greater than or equal to 0"),
	taxRate: zod
		.number()
		.min(0, "Tax rate must be greater than or equal to 0")
		.max(100, "Tax rate must be less than or equal to 100"),
});

const defaultValues = {
	number: "ORD-001",
	issueDate: new Date(),
	customer: "",
	billingAddress: { country: "", state: "", city: "", zipCode: "", line1: "", line2: "" },
	taxId: "",
	deliveryNotes: "",
	lineItems: [
		{ id: "LI-001", product: "Erbology Aloe Vera", image: "/assets/product-1.png", quantity: 1, unitPrice: 24 },
	],
	discount: 0,
	shippingRate: 0,
	taxRate: 0,
};

export function RequestCreateForm() {
	const router = useRouter();

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (_) => {
			try {
				// Make API request
				toast.success("Order created");
				router.push(paths.dashboard.requests.list);
			} catch (error) {
				logger.error(error);
				toast.error("Something went wrong!");
			}
		},
		[router]
	);

	const lineItems = watch("lineItems");
	const discount = watch("discount");
	const shippingRate = watch("shippingRate");
	const taxRate = watch("taxRate");

	const subtotal = calculateSubtotal(lineItems);
	const totalWithoutTaxes = calculateTotalWithoutTaxes(subtotal, discount, shippingRate);
	const tax = calculateTax(totalWithoutTaxes, taxRate);
	const total = calculateTotal(totalWithoutTaxes, tax);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
				<CardContent>
					<Stack divider={<Divider />} spacing={4}>
						<Stack spacing={3}>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 6,
										xs: 12,
									}}
								>
									<Controller
										control={control}
										name="customer"
										render={({ field }) => (
											<FormControl error={Boolean(errors.customer)} fullWidth>
												<InputLabel>Customer</InputLabel>
												<OutlinedInput {...field} />
												{errors.customer ? <FormHelperText>{errors.customer.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
						<Stack spacing={3}>
							<Typography variant="h6">Billing information</Typography>
							<Grid container spacing={3}>
								<Grid
									size={{
										md: 6,
										xs: 12,
									}}
								>
									<Controller
										control={control}
										name="billingAddress.country"
										render={({ field }) => (
											<FormControl error={Boolean(errors.billingAddress?.country)} fullWidth>
												<InputLabel required>Country</InputLabel>
												<Select {...field}>
													<Option value="">Choose a country</Option>
													<Option value="us">United States</Option>
													<Option value="de">Germany</Option>
													<Option value="es">Spain</Option>
												</Select>
												{errors.billingAddress?.country ? (
													<FormHelperText>{errors.billingAddress?.country?.message}</FormHelperText>
												) : null}
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
										name="billingAddress.state"
										render={({ field }) => (
											<FormControl error={Boolean(errors.billingAddress?.state)} fullWidth>
												<InputLabel required>State</InputLabel>
												<OutlinedInput {...field} />
												{errors.billingAddress?.state ? (
													<FormHelperText>{errors.billingAddress?.state?.message}</FormHelperText>
												) : null}
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
										name="billingAddress.city"
										render={({ field }) => (
											<FormControl error={Boolean(errors.billingAddress?.city)} fullWidth>
												<InputLabel required>City</InputLabel>
												<OutlinedInput {...field} />
												{errors.billingAddress?.city ? (
													<FormHelperText>{errors.billingAddress?.city?.message}</FormHelperText>
												) : null}
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
										name="billingAddress.zipCode"
										render={({ field }) => (
											<FormControl error={Boolean(errors.billingAddress?.zipCode)} fullWidth>
												<InputLabel required>Zip code</InputLabel>
												<OutlinedInput {...field} />
												{errors.billingAddress?.zipCode ? (
													<FormHelperText>{errors.billingAddress?.zipCode?.message}</FormHelperText>
												) : null}
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
										name="billingAddress.line1"
										render={({ field }) => (
											<FormControl error={Boolean(errors.billingAddress?.line1)} fullWidth>
												<InputLabel required>Address</InputLabel>
												<OutlinedInput {...field} />
												{errors.billingAddress?.line1 ? (
													<FormHelperText>{errors.billingAddress?.line1?.message}</FormHelperText>
												) : null}
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
										name="taxId"
										render={({ field }) => (
											<FormControl error={Boolean(errors.taxId)} fullWidth>
												<InputLabel>Tax ID</InputLabel>
												<OutlinedInput {...field} placeholder="e.g EU372054390" />
												{errors.taxId ? <FormHelperText>{errors.taxId.message}</FormHelperText> : null}
											</FormControl>
										)}
									/>
								</Grid>
							</Grid>
						</Stack>
					</Stack>
				</CardContent>
				<CardActions sx={{ justifyContent: "flex-end" }}>
					<Button color="secondary" variant="outlined">
						Cancelar{" "}
					</Button>
					<Button type="submit" variant="contained">
						Guardar
					</Button>
				</CardActions>
			</Card>
		</form>
	);
}
