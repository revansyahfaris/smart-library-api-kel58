import { pool } from '../config/db.js';

export const LoanModel = {

  async createLoan(book_id, member_id, due_date) {
    // Menggunakan client untuk transaksi
    const client = await pool.connect();

    try {
      // Mulai transaksi database
      await client.query('BEGIN');

      // 1. Cek ketersediaan buku
      const bookCheck = await client.query(
        'SELECT available_copies FROM books WHERE id = $1',
        [book_id]
      );

      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      // 2. Kurangi stok buku
      await client.query(
        'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
        [book_id]
      );

      // 3. Catat transaksi peminjaman
      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const result = await client.query(
        loanQuery,
        [book_id, member_id, due_date]
      );

      // Simpan semua perubahan
      await client.query('COMMIT');

      return result.rows[0];

    } catch (error) {
      // Batalkan jika ada error
      await client.query('ROLLBACK');
      throw error;

    } finally {
      // Lepaskan client kembali ke pool
      client.release();
    }
  },

  // ... tambahkan di dalam objek LoanModel ...
  async returnBook(loan_id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Ambil data peminjaman
      const loan = await client.query('SELECT book_id, status FROM loans WHERE id = $1', [loan_id]);
      if (loan.rows.length === 0) throw new Error('Data peminjaman tidak ditemukan');
      if (loan.rows[0].status === 'RETURNED') throw new Error('Buku sudah dikembalikan sebelumnya');

      const book_id = loan.rows[0].book_id;

      // 1. Update status peminjaman
      await client.query(
        "UPDATE loans SET status = 'RETURNED', return_date = NOW() WHERE id = $1",
        [loan_id]
      );

      // 2. Tambahkan stok buku
      await client.query(
        'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
        [book_id]
      );

      await client.query('COMMIT');
      return { message: "Buku berhasil dikembalikan" };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
// ... fungsi getAllLoans tetap ada ...

  async getAllLoans() {
    const query = `
      SELECT 
        l.*, 
        b.title AS book_title, 
        m.full_name AS member_name
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
    `;

    const result = await pool.query(query);
    return result.rows;
  }

};