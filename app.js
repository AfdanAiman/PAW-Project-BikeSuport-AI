const express = require('express');
const path = require('path');
const config = require('./config/appconfig');
const logger = require('./middlewares/logger');
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');
const sequelize = require('./config/database');
const ProductModel = require('./models/productModel');

const app = express();
const PORT = process.env.PORT || config.port;

// Set View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasang Middleware Logger Custom (Pencatat Request)
app.use(logger);

// Pasang Routes Web dan API
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// Fungsi untuk memasukkan data awal jika tabel kosong
async function seedInitialData() {
    const count = await ProductModel.count();
    if (count === 0) {
        await ProductModel.bulkCreate([
            { 
                name: "Ban Luar Sepeda 26 x 1.75", 
                price: 75000, 
                category: "Sparepart", 
                description: "Ban luar awet untuk segala medan jalan perkotaan. Sangat tangguh dan tahan lama untuk penggunaan harian." 
            },
            { 
                name: "Rantai Sepeda 8-Speed Index", 
                price: 55000, 
                category: "Sparepart", 
                description: "Rantai kuat dan tahan karat untuk performa operasional optimal perpindahan gigi yang halus." 
            },
            { 
                name: "Mechanical Disc Brake Set (Rem Cakram)", 
                price: 120000, 
                category: "Aksesoris", 
                description: "Pengereman lebih pakem dan responsif untuk keamanan berkendara di berbagai kondisi jalan." 
            },
            { 
                name: "Lampu LED USB Rechargeable Front/Rear", 
                price: 45000, 
                category: "Aksesoris", 
                description: "Penerangan malam hari dengan baterai isi ulang USB, sangat terang dan tahan beberapa jam." 
            },
            { 
                name: "Baterai E-Bike Lithium 36V 10Ah", 
                price: 1250000, 
                category: "E-Bike", 
                description: "Baterai cadangan berkualitas tinggi untuk sepeda listrik dengan kapasitas penuh dan proteksi daya aman." 
            }
        ]);
        console.log('[Database] Data awal (seeding) berhasil dimasukkan ke PostgreSQL.');
    }
}

// Koneksi Database & Jalankan Server
sequelize.authenticate()
    .then(async () => {
        console.log('[Database] Berhasil terhubung ke PostgreSQL.');
        await sequelize.sync({ alter: true }); // Sinkronisasi tabel otomatis
        await seedInitialData();

        app.listen(PORT, () => {
            console.log(`[Server] ${config.appName} sedang berjalan di http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('[Database] Gagal terhubung ke database:', err);
    });