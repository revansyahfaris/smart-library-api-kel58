import express from 'express';
import cors from 'cors'; // Perbaikan: Import cors yang sebelumnya hilang
import dotenv from 'dotenv';

// Import semua routes
import bookRoutes from './routes/bookRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { BookController } from './controllers/bookController.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend (seperti index.html)
app.use(express.json()); // Cukup satu baris saja
app.use(express.static('public')); // Pastikan file HTML ada di folder 'public'

// Root Route
app.get('/', (req, res) => {
  res.send('Smart Library API is Running...');
});

// Jalur API
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

// Endpoint Laporan
app.get('/api/reports/top-books', BookController.getTopBooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});