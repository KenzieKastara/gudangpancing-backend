import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;

let connected = false;

if (!MONGO_URL) {
  console.error('FATAL: MONGO_URL environment variable is not set');
  process.exit(1);
}

const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
};

mongoose.connect(MONGO_URL, connectionOptions)
  .then(() => {
    connected = true;
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed');
    console.error(error.message);
  });

export const isConnected = () => connected;
export default mongoose;
