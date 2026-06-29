/**
 * Document service – handles document upload and retrieval.
 */

import documentRepository from "../repositories/document.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class DocumentService {
  /**
   * Upload a document.
   * @param {Object} data - Document metadata (referenceType, referenceId, etc.)
   * @param {Object} file - Multer file object.
   * @returns {Promise<Object>} Created document.
   */
  async upload(data, file) {
    const documentNumber = `DOC-${Date.now()}`;
    return documentRepository.create({
      ...data,
      documentNumber,
      fileUrl: file.path,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadedById: data.uploadedById,
    });
  }

  async findAll(filters = {}) {
    return documentRepository.findAll({ ...filters, deletedAt: null });
  }

  async findById(id) {
    const doc = await documentRepository.findById(id);
    if (!doc || doc.deletedAt) {
      throw new AppError("Document not found", 404);
    }
    return doc;
  }

  async delete(id) {
    await this.findById(id);
    return documentRepository.softDelete(id);
  }
}

export default new DocumentService();
