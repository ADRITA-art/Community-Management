import { PrismaClient } from '@prisma/client';
import { generateId } from '../src/utils/id';

const prisma = new PrismaClient();

async function main() {
  const roles = ['Community Admin', 'Community Member'];

  for (const name of roles) {
    const existing = await prisma.role.findFirst({ where: { name } });
    if (!existing) {
      await prisma.role.create({
        data: {
          id: generateId(),
          name,
          scopes: [],
        },
      });
      console.log(`Created role: ${name}`);
    } else {
      console.log(`Role already exists: ${name}`);
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
