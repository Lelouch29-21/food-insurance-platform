import dotenv from 'dotenv';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import app from './app.js';
import { connectDb } from './config/db.js';
import { seedDevDataIfEmpty } from './utils/devSeed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
let memoryReplSet;
let usingInMemory = false;

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing required env var JWT_SECRET');
  }

  if (!process.env.MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGO_URI is required in production');
    }
    memoryReplSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    process.env.MONGO_URI = memoryReplSet.getUri();
    usingInMemory = true;
    process.stderr.write('MONGO_URI missing. Using in-memory MongoDB for development.\n');
  }

  await connectDb(process.env.MONGO_URI);
  if (usingInMemory) {
    await seedDevDataIfEmpty();
  }
  app.listen(PORT, () => {
    process.stdout.write(`API listening on port ${PORT}\n`);
  });
}

bootstrap().catch((err) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});

process.on('SIGINT', async () => {
  if (memoryReplSet) {
    await memoryReplSet.stop();
  }
  process.exit(0);
});
