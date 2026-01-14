import { Router } from "express";
import { AdminController } from "@controllers";
import { verifyAdmin } from "src/middlewares/verifyAdmin";

const adminRoutes = Router();

adminRoutes.get("/", verifyAdmin, AdminController.getAllAdmins);
adminRoutes.post("/", verifyAdmin, AdminController.createAdmin);
adminRoutes.get("/account", verifyAdmin, AdminController.getAccount);

export { adminRoutes };