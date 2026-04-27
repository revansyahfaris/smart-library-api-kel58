import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
  async getCategories(req, res) {
    try {
      const { name } = req.query; // Menangani parameter query pencarian
      const categories = await CategoryModel.getAll(name);
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const category = await CategoryModel.update(req.params.id, req.body.name);
      res.json({ message: "Kategori berhasil diperbarui", data: category });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      await CategoryModel.delete(req.params.id);
      res.json({ message: "Kategori berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};