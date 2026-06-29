import express from "express";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { uploadSingle } from "../middlewares/upload.js";
import documentController from "../controllers/document.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/upload", uploadSingle("file"), documentController.upload);
router.get("/", documentController.findAll);
router.get("/:id", documentController.findById);
router.delete("/:id", requireRole(["SYSTEM_ADMIN"]), documentController.delete);

export default router;
