import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      const { name } = req.query; // Menangani parameter query pencarian
      const authors = await AuthorModel.getAll(name);
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.update(req.params.id, name, nationality);
      res.json({ message: "Data penulis berhasil diperbarui", data: author });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteAuthor(req, res) {
    try {
      await AuthorModel.delete(req.params.id);
      res.json({ message: "Penulis berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};