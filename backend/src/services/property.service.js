import prisma from "../config/database.js";
import propertyRepository from "../repositories/property.repository.js";
import auditService from "./audit.service.js"; // ✅ import audit service
import { AppError } from "../middlewares/errorHandler.js";

class PropertyService {
  /**
   * Create a new property.
   */
  async create(data, userId = null, ipAddress = null, userAgent = null) {
    const property = await propertyRepository.create(data);

    // ✅ LOG TO AUDIT – GUARANTEED TO RUN
    try {
      await auditService.logAction({
        userId,
        action: "CREATE_POST_Property",
        entityType: "Property",
        entityId: property.id,
        changes: property,
        ipAddress,
        userAgent,
        metadata: {
          method: "POST",
          url: "/api/v1/properties",
          statusCode: 201,
        },
      });
      console.log("✅ Audit log saved for property:", property.id);
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return property;
  }

  /**
   * Update a property.
   */
  async update(id, data, userId = null, ipAddress = null, userAgent = null) {
    await this.findById(id);
    const property = await propertyRepository.update(id, data);

    try {
      await auditService.logAction({
        userId,
        action: "UPDATE_PUT_Property",
        entityType: "Property",
        entityId: property.id,
        changes: data,
        ipAddress,
        userAgent,
        metadata: {
          method: "PUT",
          url: `/api/v1/properties/${id}`,
          statusCode: 200,
        },
      });
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return property;
  }

  /**
   * Soft delete a property.
   */
  async delete(id, userId = null, ipAddress = null, userAgent = null) {
    await this.findById(id);
    const property = await propertyRepository.softDelete(id);

    try {
      await auditService.logAction({
        userId,
        action: "DELETE_DELETE_Property",
        entityType: "Property",
        entityId: property.id,
        changes: { deleted: true },
        ipAddress,
        userAgent,
        metadata: {
          method: "DELETE",
          url: `/api/v1/properties/${id}`,
          statusCode: 204,
        },
      });
    } catch (error) {
      console.error("❌ Audit log failed:", error.message);
    }

    return property;
  }

  /**
   * Get all properties with optional filters.
   */
  async findAll(filters = {}) {
    return propertyRepository.findAll({ ...filters, deletedAt: null });
  }

  /**
   * Get a single property by ID.
   */
  async findById(id) {
    const property = await propertyRepository.findById(id);
    if (!property || property.deletedAt) {
      throw new AppError("Property not found", 404);
    }
    return property;
  }

  /**
   * Add an image to a property.
   */
  async addImage(propertyId, file, isPrimary = false, caption = "") {
    await this.findById(propertyId);

    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: { propertyId },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.propertyImage.create({
      data: {
        propertyId,
        imageUrl: file.path.replace(/\\/g, "/"),
        caption: caption || file.originalname,
        isPrimary,
        order: 0,
      },
    });

    return image;
  }

  /**
   * Get all images for a property.
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
