import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { prisma } from '../src/lib/prisma';
import { SEED_TABLES } from '../src/features/admin/lib/mockData';

async function main() {
  for (const table of SEED_TABLES) {
    await prisma.table.updateMany({
      where: { number: table.number },
      data: {
        positionX: table.positionX,
        positionY: table.positionY,
        width: table.width,
        height: table.height,
        shape: table.shape
      }
    });
  }
  console.log("Updated tables!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
