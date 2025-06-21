"use client";

import * as React from "react";
import { savePermission } from "@/app/dashboard/requests/hooks/use-permissions";
import { getAllUsers, getUserById } from "@/app/dashboard/users/hooks/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, CircularProgress, FormControl, FormHelperText, InputLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";
import { Controller, useForm } from "react-hook-form";
import { z as zod } from "zod";

import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

export function PermissionTransferList({ permissions }) {
	const popoverAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const [checked, setChecked] = React.useState([]);
	const [left, setLeft] = React.useState(permissions);
	const [right, setRight] = React.useState([]);

	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const schema = zod.object({
		user: zod
			.object({
				id: zod.number().nullable(),
				label: zod.string().nullable(),
			})
			.refine(
				(val) =>
					typeof val === "object" &&
					val !== null &&
					"id" in val &&
					typeof val.id === "number" &&
					val.id > 0 &&
					"label" in val &&
					typeof val.label === "string" &&
					val.label.trim() !== "",
				{
					message: "Debes seleccionar un usuario",
				}
			),
	});

	const defaultValues = {
		user: { id: null, label: null },
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
		reset,
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(async (dataForm) => {
		console.log(dataForm.user);
		console.log("right", right);
		console.log("left", left);

		try {
			const permissionsToSave = right.map((item) => ({ id: item.id, granted: true }));
			console.log(permissionsToSave);

			await savePermission(dataForm.user.id, permissionsToSave);
			setAlertMsg("¡Se ha guardado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			popoverAlert.handleOpen();
			resetPermissionsList();
			reset();
		}
	});

	const fetchOptions = async (query) => {
		setLoading(true);
		try {
			const { data } = await getAllUsers({ name: query });
			const dataFormatted = data.map((user) => ({ label: user.name, id: user.id }));
			setOptions(dataFormatted);
		} catch (error) {
			console.error("Error fetching autocomplete options:", error);
		} finally {
			setLoading(false);
		}
	};

	const debounced = React.useMemo(
		() =>
			debounce((value) => {
				if (value.trim()) {
					fetchOptions(value);
				} else {
					setOptions([]);
				}
			}, 700), // Espera 700ms después del último tipo
		[]
	);

	React.useEffect(() => {
		debounced(inputValue);
		// Cleanup del debounce para evitar efectos secundarios
		return () => {
			debounced.clear();
		};
	}, [inputValue, debounced]);

	const handleGetPermissionByUserId = async (userId) => {
		if (userId == null) {
			setRight([]);
			return;
		}

		const { permissions } = await getUserById(userId);
		const permissionsFormatted = permissions
			.filter((permission) => permission.granted)
			.map((permission) => ({ id: permission.id, label: permission.label }));

		setRight(permissionsFormatted);
		const cleanLeft = left.filter(
			(leftItem) => !permissionsFormatted.some((rightItem) => rightItem.id === leftItem.id)
		);
		console.log(cleanLeft);
		setLeft(cleanLeft);
	};

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const numberOfChecked = (items) => intersection(checked, items).length;

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setChecked(not(checked, items));
		} else {
			setChecked(union(checked, items));
		}
	};

	const handleCheckedRight = () => {
		if (getValues("user").id === null) {
			setAlertMsg("Debes elegir un usuario primero");
			setAlertSeverity("error");
			popoverAlert.handleOpen();
			return;
		}

		setRight([...right, ...leftChecked]);
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
	};

	const handleCheckedLeft = () => {
		setLeft([...left, ...rightChecked]);
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const resetPermissionsList = () => {
		setLeft(permissions);
		setRight([]);
	};

	const customList = (title, items) => {
		return (
			<Card>
				<CardHeader
					sx={{ px: 2, py: 1 }}
					avatar={
						<Checkbox
							onClick={handleToggleAll(items)}
							checked={numberOfChecked(items) === items.length && items.length > 0}
							indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
							disabled={items.length === 0}
							inputProps={{
								"aria-label": "all items selected",
							}}
						/>
					}
					title={title}
					subheader={`${numberOfChecked(items)}/${items.length} selected`}
				/>
				<Divider />
				<List
					sx={{
						width: 200,
						height: 230,
						bgcolor: "background.paper",
						overflow: "auto",
					}}
					dense
					component="div"
					role="list"
				>
					{items.map((item) => {
						const labelId = `transfer-list-all-item-${item.id}-label`;
						return (
							<ListItemButton key={item.id} role="listitem" onClick={handleToggle(item)}>
								<ListItemIcon>
									<Checkbox
										checked={checked.includes(item)}
										tabIndex={-1}
										disableRipple
										inputProps={{
											"aria-labelledby": labelId,
										}}
									/>
								</ListItemIcon>
								<ListItemText id={labelId} primary={`${item.label}`} />
							</ListItemButton>
						);
					})}
				</List>
			</Card>
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={4} sx={{ justifyContent: "center", alignItems: "center", padding: 4 }}>
				<Grid
					size={{
						md: 6,
						xs: 12,
					}}
					direction={"row"}
				>
					<Controller
						control={control}
						name="user"
						render={({ field }) => {
							return (
								<FormControl error={Boolean(errors.user)} fullWidth>
									<InputLabel required sx={{ marginBottom: "0.5rem" }}>
										Usuario
									</InputLabel>
									<Autocomplete
										freeSolo
										options={options}
										loading={loading}
										inputValue={inputValue}
										value={field.value || null}
										onInputChange={(event, newInputValue) => {
											setInputValue(newInputValue);
										}}
										onChange={(event, newValue) => {
											handleGetPermissionByUserId(newValue?.id);
											field.onChange(newValue ?? { id: null, label: null });
											resetPermissionsList();
										}}
										getOptionLabel={(option) => (typeof option === "string" ? option : option?.label || "")}
										isOptionEqualToValue={(option, value) => option?.label === value?.label}
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder="Escribe su nombre"
												variant="outlined"
												slotProps={{
													input: {
														...params.InputProps,
														endAdornment: (
															<React.Fragment>
																{loading ? <CircularProgress color="inherit" size={20} /> : null}
																{params.InputProps.endAdornment}
															</React.Fragment>
														),
													},
												}}
											/>
										)}
									/>
									{errors.user ? <FormHelperText>{errors.user.message}</FormHelperText> : null}
								</FormControl>
							);
						}}
					/>
				</Grid>
				<Grid
					size={{
						md: 12,
						xs: 12,
					}}
					container
					direction="row"
					alignItems="center"
					justifyContent="center"
				>
					<Grid>{customList("Permisos", left)}</Grid>
					<Grid>
						<Grid container direction="column" sx={{ alignItems: "center" }}>
							<Button
								sx={{ my: 0.5 }}
								variant="outlined"
								size="small"
								onClick={handleCheckedRight}
								disabled={leftChecked.length === 0}
								aria-label="move selected right"
							>
								&gt;
							</Button>
							<Button
								sx={{ my: 0.5 }}
								variant="outlined"
								size="small"
								onClick={handleCheckedLeft}
								disabled={rightChecked.length === 0}
								aria-label="move selected left"
							>
								&lt;
							</Button>
						</Grid>
					</Grid>
					<Grid>{customList("Asignados", right)}</Grid>
				</Grid>
				<Grid size={{ md: 12, xs: 12 }} container spacing={1} justifyContent="center">
					<Button variant="outlined" color="primary">
						Cancelar
					</Button>
					<Button variant="contained" color="primary" type="submit">
						Guardar
					</Button>
				</Grid>
			</Grid>
			<NotificationAlert
				openAlert={popoverAlert.open}
				onClose={popoverAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</form>
	);
}

function not(a, b) {
	return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
	return a.filter((value) => b.includes(value));
}

function union(a, b) {
	return [...a, ...not(b, a)];
}
