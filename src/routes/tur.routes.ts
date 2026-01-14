import { Router } from "express";
import { TurController } from "@controllers";
import { verifyAdmin } from "src/middlewares/verifyAdmin";

const turRoutes = Router();

turRoutes.get("/", TurController.getAllTurs);
turRoutes.get("/:id", TurController.getOneTur);
turRoutes.post("/", verifyAdmin, TurController.createTur);
turRoutes.patch("/:id", verifyAdmin, TurController.editTur);
turRoutes.delete("/:id", verifyAdmin, TurController.deleteTur);

export { turRoutes };