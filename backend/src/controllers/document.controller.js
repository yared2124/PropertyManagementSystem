/**
 * Document controller – handles file upload and document metadata.
 */

import documentService from "../services/document.service.js";
import { successResponse } from "../utils/apiResponse.js";

class DocumentController {
  async upload(req, res, next) {
    try {
      // req.file is the uploaded file (multer)
      const doc = await documentService.upload(req.body, req.file);
      res.status(201).json(successResponse(doc, "Document uploaded", 201));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const docs = await documentService.findAll(req.query);
      res.status(200).json(successResponse(docs));
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const doc = await documentService.findById(req.params.id);
      res.status(200).json(successResponse(doc));
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await documentService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();
