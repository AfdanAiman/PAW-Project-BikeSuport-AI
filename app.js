const express = require('express');
const path = require('path');
const session = require('express-session');
const config = require('./config/appconfig');
const logger = require('./middlewares/logger');
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');
const chatRoutes = require('./routes/chat.routes'); 
const storeRoutes = require('./routes/storeRoutes');  
const orderRoutes = require('./routes/orderRoutes');
const storeStatus = require('./middlewares/storeStatus');
const sequelize = require('./config/database');
const ProductModel = require('./models/productModel');
const OrderModel = require('./models/orderModel');

// 1. INISIALISASI 'app' HARUS PALING ATAS SEBELUM APAPUN MENGGUNAKANNYA
const app = express();
const PORT = process.env.PORT || config.port;

// Set View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware Static & Parser (Cukup dipanggil sekali dengan benar)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'bikesupport_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 Hari
}));

// Middleware Global agar variabel isAdmin terbaca di semua file EJS
app.use((req, res, next) => {
    res.locals.isAdmin = req.session.isAdmin || false;
    next();
});

// Pasang Middleware Logger Custom (Pencatat Request)
app.use(logger);

// PASANG MIDDLEWARE STORE STATUS
app.use(storeStatus);

// --- RUTE LOGIN & LOGOUT ADMIN ---
app.get('/login', (req, res) => {
    if (req.session.isAdmin) return res.redirect('/');
    res.render('login', { title: 'Login Admin — BikeSupport', error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'bikesupport123';

    if (username === adminUser && password === adminPass) {
        req.session.isAdmin = true;
        return res.redirect('/');
    }
    res.render('login', { 
        title: 'Login Admin — BikeSupport', 
        error: 'Username atau Password salah!' 
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// --- DAFTARKAN SEMUA RUTE DI SINI ---
app.use('/', orderRoutes);
app.use('/', storeRoutes);         
app.use('/', webRoutes);           

// Pasang Routes API
app.use('/api/chat', chatRoutes); 
app.use('/api', apiRoutes);

// Fungsi untuk memasukkan data awal jika tabel produk kosong
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
        await sequelize.sync({ alter: true });
        await seedInitialData();

        app.listen(PORT, () => {
            console.log(`[Server] ${config.appName} sedang berjalan di http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('[Database] Gagal terhubung ke database:', err);
    });