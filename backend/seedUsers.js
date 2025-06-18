const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');
require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();

    // Seed Users
    const users = [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user',
      },
    ];
    await User.deleteMany({});
    await User.insertMany(users);

    // Seed Products
    const products = [
      { name: 'Sample Product 1', averageRating: 0 },
      { name: 'Sample Product 2', averageRating: 0 },
    ];
    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log('Data seeded successfully:');
    console.log('Users:');
    console.log('- admin@example.com / admin123 (Admin)');
    console.log('- user@example.com / user123 (User)');
    console.log('Products:');
    console.log('- Sample Product 1');
    console.log('- Sample Product 2');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();