import { pool } from '../config/db.js';

export const AuthorModel = {
  async getAll(search = '') {
    const query = `SELECT * FROM authors WHERE name ILIKE $1 ORDER BY name ASC`;
    const result = await pool.query(query, [`%${search}%`]);
    return result.rows;
  },
  async create(name, nationality) {
    const query = `INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },
  async update(id, name, nationality) {
    const query = `UPDATE authors SET name = $1, nationality = $2 WHERE id = $3 RETURNING *`;
    const result = await pool.query(query, [name, nationality, id]);
    return result.rows[0];
  },
  async delete(id) {
    await pool.query('DELETE FROM authors WHERE id = $1', [id]);
    return { message: "Author berhasil dihapus" };
  }
};