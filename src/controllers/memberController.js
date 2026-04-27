import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  // Mendapatkan semua daftar anggota
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mendaftarkan anggota baru
  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({
        message: "Anggota berhasil didaftarkan!",
        data: newMember
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Tambahkan fungsi updateMember (Penyebab Error)
  async updateMember(req, res) {
    try {
      const updated = await MemberModel.update(req.params.id, req.body);
      res.json({ message: "Data anggota berhasil diperbarui", data: updated });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Tambahkan fungsi deleteMember
  async deleteMember(req, res) {
    try {
      await MemberModel.delete(req.params.id);
      res.json({ message: "Anggota berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};