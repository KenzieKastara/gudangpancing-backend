import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const carouselCount = await prisma.carouselItem.count();
    const instagramCount = await prisma.instagramPost.count();
    const settingsCount = await prisma.siteSetting.count();
    
    console.log('Carousel items:', carouselCount);
    console.log('Instagram posts:', instagramCount);
    console.log('Settings:', settingsCount);
    
    if (carouselCount === 0) {
      console.log('\n❌ No data in database - running seed...');
      await import('./seed.js');
    } else {
      console.log('\n✅ Database has data');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
