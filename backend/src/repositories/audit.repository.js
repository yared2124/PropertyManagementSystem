/**
 * Audit log repository – extends BaseRepository for audit logs.
 */

import prisma from "../config/database.js";
import { BaseRepository } from "./base.repository.js";

class AuditRepository extends BaseRepository {
  constructor() {
    super(prisma.auditLog);
  }
}

export default new AuditRepository();
