import { Router } from "express";
import { AdminController } from "@controllers";
import { verifyAdmin } from "src/middlewares/verifyAdmin";

const adminRoutes = Router();

adminRoutes.post("/login", AdminController.login);
adminRoutes.get("/", verifyAdmin, AdminController.getAllAdmins);
adminRoutes.post("/", verifyAdmin, AdminController.createAdmin);
adminRoutes.get("/account", verifyAdmin, AdminController.getAccount);
adminRoutes.patch("/password", verifyAdmin, AdminController.editPassword);
adminRoutes.patch("/username", verifyAdmin, AdminController.editUsername);

export { adminRoutes };