import { Router } from "express";
import { TurController } from "@controllers";
import { verifyAdmin } from "src/middlewares/verifyAdmin";
import { uploadTurPhotos } from "@config";

const turRoutes = Router();

turRoutes.get("/", TurController.getAllTurs);
turRoutes.get("/:id", TurController.getOneTur);
turRoutes.post("/", verifyAdmin, uploadTurPhotos.array("files", 15), TurController.createTur);
turRoutes.patch("/:id", verifyAdmin, uploadTurPhotos.array("files", 15), TurController.editTur);
turRoutes.delete("/:id", verifyAdmin, TurController.deleteTur);

export { turRoutes };