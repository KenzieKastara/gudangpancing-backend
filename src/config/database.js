import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'gudang_pancing';

let connected = false;

// Build connection URL - handle both Atlas and local MongoDB
const buildConnectionUrl = () => {
  // If MONGO_URL already contains a database name (Atlas format), use it as-is
  // Atlas URLs look like: mongodb+srv://user:pass@cluster.mongodb.net/dbname
  if (MONGO_URL.includes('mongodb+srv://') || MONGO_URL.includes('mongodb.net')) {
    // Atlas URL - check if database is already in URL
    if (MONGO_URL.includes('mongodb.net/') && !MONGO_URL.includes('mongodb.net/?')) {
      return MONGO_URL; // Already has database name
    }
    // Add database name to Atlas URL
    const baseUrl = MONGO_URL.replace(/\/?$/, '');
    return `${baseUrl}/${DB_NAME}`;
  }
  // Local MongoDB - append database name
  return `${MONGO_URL}/${DB_NAME}`;
};

// Connection options for better stability
const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
  w: 'majority'
};

// Connect to MongoDB
mongoose.connect(buildConnectionUrl(), connectionOptions)
  .then(() => {
    connected = true;
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed - Running in safe mode');
    console.warn(error.message);
  });

export const isConnected = () => connected;
export default mongoose;

