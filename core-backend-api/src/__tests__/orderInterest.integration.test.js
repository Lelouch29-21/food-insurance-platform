import request from 'supertest';
import bcrypt from 'bcrypt';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import app from '../app.js';
import { connectDb, disconnectDb } from '../config/db.js';
import User from '../models/User.js';
import FoodItem from '../models/FoodItem.js';
import InsurancePlan from '../models/InsurancePlan.js';
import InterestAdjustmentLog from '../models/InterestAdjustmentLog.js';

let mongod;
let user;
let tokenCookie;
let plan;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.COOKIE_SECURE = 'false';

  mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await connectDb(mongod.getUri());

  const hashed = await bcrypt.hash('Password123', 12);
  user = await User.create({
    name: 'Integration User',
    email: 'integration@example.com',
    password: hashed,
    role: 'USER',
  });

  plan = await InsurancePlan.create({
    name: 'Smart Protect',
    baseInterestRate: 6,
    currentInterestRate: 6,
  });

  await FoodItem.create([
    { name: 'Salad Bowl', category: 'VEG', price: 300, healthScore: 90, isActive: true },
    { name: 'Pasta', category: 'NON_VEG', price: 800, healthScore: 40, isActive: true },
  ]);

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'integration@example.com', password: 'Password123' });

  tokenCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
});

afterAll(async () => {
  await disconnectDb();
  await mongod.stop();
});

describe('order to interest flow', () => {
  test('creates order and applies adjustment log', async () => {
    const foods = await FoodItem.find().lean();

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Cookie', tokenCookie)
      .send({
        planId: plan._id.toString(),
        items: [
          { foodItemId: foods[0]._id.toString(), quantity: 1 },
          { foodItemId: foods[1]._id.toString(), quantity: 1 },
        ],
      });

    if (response.status !== 201) {
      throw new Error(`Order creation failed: ${JSON.stringify(response.body)}`);
    }

    expect(response.status).toBe(201);
    expect(response.body.interest.adjustment).toBe(0.9);

    const updatedPlan = await InsurancePlan.findById(plan._id).lean();
    expect(updatedPlan.currentInterestRate).toBeCloseTo(6.9, 5);

    const logs = await InterestAdjustmentLog.find({ userId: user._id }).lean();
    expect(logs).toHaveLength(1);
  });
});
