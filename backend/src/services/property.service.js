/**
 * Property service – manages property CRUD operations.
 * Includes image upload functionality.
 */

import prisma from "../config/database.js";
import propertyRepository from "../repositories/property.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

class PropertyService {
  /**
   * Create a new property.
   * @param {Object} data - Property data.
   * @returns {Promise<Object>} Created property.
   */
  async create(data) {
    return propertyRepository.create(data);
  }

  /**
   * Get all properties with optional filters.
   * @param {Object} filters - Query filters (status, city, etc.).
   * @returns {Promise<Array>} List of properties.
   */
  async findAll(filters = {}) {
    return propertyRepository.findAll({ ...filters, deletedAt: null });
  }

  /**
   * Get a single property by ID.
   * @param {string} id - Property UUID.
   * @returns {Promise<Object>} Property object.
   * @throws {AppError} If property not found or soft‑deleted.
   */
  async findById(id) {
    const property = await propertyRepository.findById(id);
    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404);
    }
    return property;
  }

  /**
   * Update a property.
   * @param {string} id - Property UUID.
   * @param {Object} data - Fields to update.
   * @returns {Promise<Object>} Updated property.
   */
  async update(id, data) {
    await this.findById(id); // ensure exists
    return propertyRepository.update(id, data);
  }

  /**
   * Soft‑delete a property.
   * @param {string} id - Property UUID.
   * @returns {Promise<Object>} Updated property with deletedAt set.
   */
  async delete(id) {
    await this.findById(id);
    return propertyRepository.softDelete(id);
  }

  /**
   * Add an image to a property.
   * @param {string} propertyId - UUID of the property.
   * @param {Object} file - Multer file object (contains path, originalname, etc.)
   * @param {boolean} isPrimary - Whether this image is the primary one.
   * @param {string} caption - Optional caption.
   * @returns {Promise<Object>} Created PropertyImage record.
   */
  async addImage(propertyId, file, isPrimary = false, caption = "") {
    // Ensure the property exists
    await this.findById(propertyId);

    // If this image is primary, set all other images of this property to non‑primary
    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: { propertyId },
        data: { isPrimary: false },
      });
    }

    // Create the image record
    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        imageUrl: file.path, // or file.location if using cloud storage
        caption: caption || file.originalname,
        isPrimary,
        order: 0, // you can implement order logic if needed
      },
    });

    return image;
  }

  /**
   * Remove an image from a property.
   * @param {string} imageId - UUID of the PropertyImage record.
   * @returns {Promise<Object>} Deleted image record.
   */
  async removeImage(imageId) {
    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });
    if (!image) {
      throw new AppError("Image not found", 404);
    }
    // Optionally delete the physical file
    // deleteFile(image.imageUrl);
    return prisma.propertyImage.delete({
      where: { id: imageId },
    });
  }

  /**
   * Get all images for a property.
   * @param {string} propertyId - UUID of the property.
   * @returns {Promise<Array>} List of images.
   */
  async getImages(propertyId) {
    await this.findById(propertyId);
    return prisma.propertyImage.findMany({
      where: { propertyId },
      orderBy: { order: "asc" },
    });
  }
}

export default new PropertyService();
