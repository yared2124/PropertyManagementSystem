import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class InspectionRepository extends BaseRepository {
  constructor() {
    super(prisma.inspection);
  }

  async findByProperty(propertyId) {
    return this.model.findMany({ where: { propertyId, deletedAt: null } });
  }

  async findByInspector(inspectorId) {
    return this.model.findMany({ where: { inspectorId, deletedAt: null } });
  }

  async findByStatus(status) {
    return this.model.findMany({ where: { status, deletedAt: null } });
  }
}

export default new InspectionRepository();
