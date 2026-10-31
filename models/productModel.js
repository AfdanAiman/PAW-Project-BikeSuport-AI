const products = [
    { 
        id: 1, 
        name: "Ban Luar Sepeda 26 x 1.75", 
        price: 75000, 
        category: "Sparepart", 
        description: "Ban luar awet untuk segala medan jalan perkotaan. Sangat tangguh dan tahan lama untuk penggunaan harian." 
    },
    { 
        id: 2, 
        name: "Rantai Sepeda 8-Speed Index", 
        price: 55000, 
        category: "Sparepart", 
        description: "Rantai kuat dan tahan karat untuk performa operasional optimal perpindahan gigi yang halus." 
    },
    { 
        id: 3, 
        name: "Mechanical Disc Brake Set (Rem Cakram)", 
        price: 120000, 
        category: "Aksesoris", 
        description: "Pengereman lebih pakem dan responsif untuk keamanan berkendara di berbagai kondisi jalan." 
    },
    { 
        id: 4, 
        name: "Lampu LED USB Rechargeable Front/Rear", 
        price: 45000, 
        category: "Aksesoris", 
        description: "Penerangan malam hari dengan baterai isi ulang USB, sangat terang dan tahan beberapa jam." 
    },
    { 
        id: 5, 
        name: "Baterai E-Bike Lithium 36V 10Ah", 
        price: 1250000, 
        category: "E-Bike", 
        description: "Baterai cadangan berkualitas tinggi untuk sepeda listrik dengan kapasitas penuh dan proteksi daya aman." 
    }
];

class ProductModel {
    static getAll() {
        return products;
    }

    static getById(id) {
        return products.find(p => p.id == id);
    }
}
module.exports = ProductModel;