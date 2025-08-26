"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deletePaymentInformation } from "@/app/dashboard/configuration/payment-information/hooks/use-payments-information";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogTitle, Tooltip, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import { Plus as PlusIcon, X as XIcon } from "@phosphor-icons/react/dist/ssr";

import { usePopover } from "@/hooks/use-popover";
import { NotificationAlert } from "@/components/widgets/notifications/notification-alert";

import { PaymentAccountInformation } from "./payment-account-information";

export function PaymentAccountTabs({ tabsInfo }) {
	const router = useRouter();
	const modalDeleteAccount = usePopover();
	const notificationAlert = usePopover();
	const [alertMsg, setAlertMsg] = React.useState("");
	const [alertSeverity, setAlertSeverity] = React.useState("success");

	const defaultTab = {
		id: 1,
		label: `Cuenta ${1}`,
		isPrimary: false,
		paymentAccount: {
			id: "",
			bankName: "",
			accountNumber: "",
			accountType: "",
			currency: "",
			limit: "",
			dailyReceived: "",
			isActive: "",
			updatedAt: "",
			isPrimary: false,
			holderName: "",
			holderDocument: "",
		},
	};

	const [tabSelected, setTabSelected] = React.useState(1);
	const [accountToDelete, setAccountToDelete] = React.useState(null);
	const [tabs, setTabs] = React.useState([defaultTab]);

	React.useEffect(() => {
		if (tabsInfo.length > 0) {
			setTabs(tabsInfo);
		}
	}, [tabsInfo]);

	const handleChange = (_, newValue) => {
		setTabSelected(newValue);
	};

	const handleAddTab = () => {
		const maxId = tabs.reduce((max, obj) => Math.max(max, obj.id), 0);
		const newIndex = maxId + 1;
		const newTab = {
			id: newIndex,
			label: `Cuenta ${newIndex}`,
			isPrimary: false,
			paymentAccount: {
				id: null,
				bankName: "",
				accountNumber: "",
				accountType: "",
				currency: "",
				limit: "",
				dailyReceived: "",
				isActive: "",
				updatedAt: "",
				isPrimary: false,
				holderName: "",
				holderDocument: "",
			},
		};
		setTabs((prev) => [...prev, newTab]);
		setTabSelected(newTab.id);
	};

	const handleRemoveTab = (tabValue, event, paymentAccount) => {
		event.stopPropagation(); // Prevenir cambio de tab

		if (paymentAccount.id) {
			setAccountToDelete(paymentAccount);
			modalDeleteAccount.handleOpen();
		} else {
			if (tabs.length > 1) {
				setTabs((prev) => prev.filter((tab) => tab.id !== tabValue));
			}

			// Si estás eliminando la tab activa, cambia a otra existente
			if (tabSelected === tabValue && tabs.length > 1) {
				const nextTab = tabs.find((t) => t.id !== tabValue);
				if (nextTab) setTabSelected(nextTab.id);
			}
		}
	};

	const handleDeleteAccount = async () => {
		try {
			await deletePaymentInformation(accountToDelete.id);
			setAlertMsg("¡Borrado exitosamente!");
			setAlertSeverity("success");
		} catch (error) {
			setAlertMsg(error.message);
			setAlertSeverity("error");
		} finally {
			notificationAlert.handleOpen();
			modalDeleteAccount.handleClose();
			setTabSelected(1);
			if (tabs.length === 1) {
				setTabs([defaultTab]);
			} else {
				setTabs((prev) => prev.filter((tab) => tab.id !== accountToDelete.id));
			}

			router.refresh();
		}
	};

	return (
		<Box sx={{ width: "100%", typography: "body1" }} padding={3}>
			<TabContext value={tabSelected}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList onChange={handleChange} variant="scrollable" scrollButtons="auto">
						{tabs.map((item) => (
							<Tab
								wrapped
								key={item.id}
								label={
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Typography fontWeight={"bold"}>{item.label}</Typography>
										{
											<span
												onClick={(event) => handleRemoveTab(item.id, event, item.paymentAccount)}
												style={{
													cursor: "pointer",
													marginLeft: "0.5rem",
													display: "flex",
													alignItems: "center",
												}}
											>
												<XIcon size={18} />
											</span>
										}
									</Box>
								}
								value={item.id}
							/>
						))}
						<Tab
							sx={{ width: "2rem" }}
							icon={
								<Tooltip title="Añadir nueva cuenta">
									<PlusIcon size={18} />
								</Tooltip>
							}
							aria-label="Add tab"
							value="add"
							onClick={handleAddTab}
						/>
					</TabList>
				</Box>
				{tabs.map((item) => (
					<TabPanel key={item.id} value={item.id}>
						<PaymentAccountInformation paymentAccount={item.paymentAccount} />
					</TabPanel>
				))}
			</TabContext>

			{/* Modal para eliminar cuenta de pago	 */}
			<Dialog
				fullWidth
				maxWidth={"xs"}
				open={modalDeleteAccount.open}
				onClose={modalDeleteAccount.handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" textAlign={"center"} sx={{ pt: 4 }}>
					{"Desactivar cuenta"}
				</DialogTitle>

				<DialogContent>
					<DialogContentText id="alert-dialog-description" textAlign={"center"} sx={{ pb: 2 }}>
						{`¿Desea desactivar la cuenta de pago ${accountToDelete?.accountNumber}?`}
					</DialogContentText>

					<Box component={"div"} display={"flex"} justifyContent={"flex-end"} gap={2} padding={1}>
						<Button variant="contained" onClick={handleDeleteAccount}>
							Aceptar
						</Button>
						<Button
							variant="outlined"
							onClick={() => {
								modalDeleteAccount.handleClose();
							}}
						>
							Cancelar
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			<NotificationAlert
				openAlert={notificationAlert.open}
				onClose={notificationAlert.handleClose}
				msg={alertMsg}
				severity={alertSeverity}
			></NotificationAlert>
		</Box>
	);
}
