import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const { title } = req.query; // Menangani parameter query pencarian
      const books = await BookModel.getAll(title);
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateBook(req, res) {
    try {
      const updatedBook = await BookModel.update(req.params.id, req.body);
      res.json({ message: "Data buku berhasil diperbarui", data: updatedBook });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteBook(req, res) {
    try {
      await BookModel.delete(req.params.id);
      res.json({ message: "Buku berhasil dihapus dari sistem" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};