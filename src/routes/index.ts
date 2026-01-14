import { Router } from "express";
import { adminRoutes } from "./admin.routes";
import { turRoutes } from "./tur.routes";
import { bookingRoutes } from "./booking.routes";

const router: Router = Router();

router.use("/admins", adminRoutes);
router.use("/turs", turRoutes);
router.use("/bookings", bookingRoutes);

export default router;