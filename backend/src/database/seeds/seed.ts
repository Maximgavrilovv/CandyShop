import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import * as bcrypt from 'bcryptjs';
interface InventoryItem { name: string; flavour: string; description: string; stock: number; available: boolean; weight: number; }
async function seed() {
  await AppDataSource.initialize();
  console.log('🌱 Seeding...');
  const userRepo = AppDataSource.getRepository('users');
  for (const u of [{ email: 'alice@example.com', password: 'password123' }, { email: 'bob@example.com', password: 'password123' }]) {
    if (!(await userRepo.findOneBy({ email: u.email }))) {
      await userRepo.save(userRepo.create({ email: u.email, password: await bcrypt.hash(u.password, 10) }));
      console.log(`  ✓ user: ${u.email}`);
    } else { console.log(`  – user exists: ${u.email}`); }
  }
  const candyRepo = AppDataSource.getRepository('candies');
  if ((await candyRepo.count()) > 0) { console.log('  – candies already seeded'); await AppDataSource.destroy(); return; }
  console.log('  Fetching inventory...');
  const res = await fetch('https://6a200958e96c1d13b586e6f7.mockapi.io/candy-api/v1/inventory');
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const items: InventoryItem[] = await res.json();
  await candyRepo.save(items.map((i) => ({ name: i.name, flavour: i.flavour, description: i.description, stock: Math.max(0, i.stock ?? 0), available: i.available ?? true, weight: i.weight })));
  console.log(`  ✓ seeded ${items.length} candies`);
  await AppDataSource.destroy();
  console.log('✅ done');
}
seed().catch((e) => { console.error(e); process.exit(1); });
