import { Router } from "express";
import { BookingController } from "@controllers";
import { verifyAdmin } from "src/middlewares/verifyAdmin";

const bookingRoutes = Router();

bookingRoutes.get("/", verifyAdmin, BookingController.getAllBookings);
bookingRoutes.post("/", BookingController.createBooking);
bookingRoutes.get("/history", verifyAdmin, BookingController.getHistoryBookings);
bookingRoutes.get("/:id", verifyAdmin, BookingController.getOneBooking);
bookingRoutes.get("/history/:id", verifyAdmin, BookingController.getOneHistoryBooking);
bookingRoutes.delete("/:id", verifyAdmin, BookingController.deleteBooking);

export { bookingRoutes };