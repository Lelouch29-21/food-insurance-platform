import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDb, disconnectDb } from '../src/config/db.js';
import User from '../src/models/User.js';
import FoodItem from '../src/models/FoodItem.js';
import InsurancePlan from '../src/models/InsurancePlan.js';

dotenv.config();

async function run() {
  await connectDb(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({}), FoodItem.deleteMany({}), InsurancePlan.deleteMany({})]);

  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  const userPassword = await bcrypt.hash('User@12345', 12);

  await User.create([
    { name: 'Admin User', email: 'admin@demo.com', password: adminPassword, role: 'ADMIN' },
    { name: 'Sample User', email: 'user@demo.com', password: userPassword, role: 'USER' },
  ]);

  await FoodItem.create([
    { name: 'Grilled Paneer Bowl', category: 'VEG', price: 350, healthScore: 84, isActive: true },
    { name: 'Protein Chicken Wrap', category: 'NON_VEG', price: 420, healthScore: 72, isActive: true },
    { name: 'Cold Brew Coffee', category: 'BEVERAGE', price: 220, healthScore: 35, isActive: true },
    { name: 'Fruit Yogurt Parfait', category: 'DESSERT', price: 280, healthScore: 66, isActive: true },
    { name: 'Veggie Quinoa Salad', category: 'VEG', price: 390, healthScore: 91, isActive: true },
    { name: 'Cheese Burst Pizza Slice', category: 'NON_VEG', price: 500, healthScore: 20, isActive: true },
  ]);

  await InsurancePlan.create([
    {
      name: 'ABSLI DigiShield Plan',
      baseInterestRate: 6.8,
      currentInterestRate: 6.8,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    {
      name: 'ABSLI Guaranteed Milestone Plan',
      baseInterestRate: 7.1,
      currentInterestRate: 7.1,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    {
      name: 'ABSLI Empower Pension Plan',
      baseInterestRate: 7.4,
      currentInterestRate: 7.4,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    {
      name: 'ABSLI Fortune Elite Plan',
      baseInterestRate: 7.6,
      currentInterestRate: 7.6,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    {
      name: 'ABSLI Wealth Aspire Plan',
      baseInterestRate: 7.3,
      currentInterestRate: 7.3,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
    {
      name: "ABSLI Child's Future Assured Plan",
      baseInterestRate: 6.9,
      currentInterestRate: 6.9,
      provider: 'Aditya Birla Sun Life Insurance (Demo Data)',
    },
  ]);

  process.stdout.write('Seed completed.\n');
  process.stdout.write('Admin: admin@demo.com / Admin@12345\n');
  process.stdout.write('User: user@demo.com / User@12345\n');
}

run()
  .catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });
