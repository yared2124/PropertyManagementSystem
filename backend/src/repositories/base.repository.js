/**
 * Base repository class providing common CRUD operations.
 * Extended by model‑specific repositories to avoid code duplication.
 */

export class BaseRepository {
  /**
   * @param {PrismaModel} model - The Prisma model (e.g., prisma.user).
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new record.
   * @param {Object} data - The data to insert.
   * @returns {Promise<Object>} Created record.
   */
  async create(data) {
    return this.model.create({ data });
  }

  /**
   * Find a record by its primary key (id).
   * @param {string} id - UUID of the record.
   * @returns {Promise<Object|null>} The record or null.
   */
  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }

  /**
   * Find a single record matching a condition.
   * @param {Object} where - Prisma `where` clause.
   * @returns {Promise<Object|null>} The record or null.
   */
  async findOne(where) {
    return this.model.findFirst({ where });
  }

  /**
   * Find all records with optional filters and sorting.
   * @param {Object} where - Prisma `where` clause.
   * @param {Object} options - Additional options (orderBy, skip, take, include).
   * @returns {Promise<Array>} List of records.
   */
  async findAll(where = {}, options = {}) {
    return this.model.findMany({ where, ...options });
  }

  /**
   * Update a record.
   * @param {string} id - UUID of the record.
   * @param {Object} data - The data to update.
   * @returns {Promise<Object>} Updated record.
   */
  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  /**
   * Soft delete a record (sets deletedAt timestamp).
   * @param {string} id - UUID of the record.
   * @returns {Promise<Object>} Updated record with deletedAt set.
   */
  async softDelete(id) {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
