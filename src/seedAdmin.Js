import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/admin.model.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const hashed = await bcrypt.hash('123456', 10);

  await Admin.create({
    username: 'GPadmin',
    email: 'admin@gudangpancing.com',
    password: hashed
  });

  console.log('Admin created');
  process.exit();
};

run();
