import prisma from './src/config/database.js';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // 1. Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@gudangpancing.com',
        username: 'admin',
        password: hashedPassword
      }
    });
    console.log('✅ Admin created:', admin.username, admin.email);

    // 2. Initialize settings
    console.log('\nInitializing site settings...');
    const settings = [
      { key: 'phone_number', value: '0813-8535-3835' },
      { key: 'whatsapp_number', value: '6281385353835' },
      { key: 'instagram_link', value: 'https://www.instagram.com/gudang.pancing' },
      { key: 'tiktokshop_link', value: 'https://vt.tiktok.com/ZSaphRMjk/?page=Mall' },
      { key: 'tokopedia_link', value: 'https://tk.tokopedia.com/ZSaprv2rN/' },
      { key: 'shopee_link', value: 'https://id.shp.ee/ziz2aZB' },
      { key: 'store_name', value: 'Gudang Pancing' },
      { key: 'store_address', value: 'Ruko Terrace 9, Jl Jati Utama Blok D No.52, Suvarna Sutera, Tangerang' },
      { key: 'operating_hours', value: 'Senin - Minggu: 09.00 - 21.00 WIB' }
    ];

    for (const setting of settings) {
      await prisma.siteSetting.create({ data: setting });
    }
    console.log('✅ Settings initialized:', settings.length, 'items');

    // 3. Create carousel items (existing products)
    console.log('\nCreating carousel items...');
    const products = [
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/gwy0podm_1000095319.jpg',
        productName: 'Senar Pancing Blood Big Bass 150M',
        price: 39000,
        currency: 'IDR',
        link: 'https://s.shopee.co.id/9KcITMwQXo?share_channel_code=1',
        badge: 'Ready Stock',
        sortOrder: 1
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/6gir5n5r_1000095321.jpg',
        productName: 'Kail Pancing Mustad 2335',
        price: 26500,
        currency: 'IDR',
        link: 'https://s.shopee.co.id/50TJJTKFGE?share_channel_code=1',
        badge: 'Best Seller',
        sortOrder: 2
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/cdim0pv1_1000095324.jpg',
        productName: 'Rod Pancing Daido BLACK REAPER DRS',
        price: 289750,
        currency: 'IDR',
        link: 'https://s.shopee.co.id/3qHLvM6gyA?share_channel_code=1',
        badge: 'Ready Stock',
        sortOrder: 3
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/rt4b0cox_1000095326.jpg',
        productName: 'Reel Pancing Daido BLACK BISON PRO',
        price: 571900,
        currency: 'IDR',
        link: 'https://s.shopee.co.id/4AuCK0QgNS?share_channel_code=1',
        badge: 'Best Seller',
        sortOrder: 4
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/j16wfrlp_1000095328.jpg',
        productName: 'Umpan Pancing Pro Hunter Ko Jack 110mm',
        price: 67500,
        currency: 'IDR',
        link: 'https://s.shopee.co.id/806ut89rai?share_channel_code=1',
        badge: 'Ready Stock',
        sortOrder: 5
      }
    ];

    for (const product of products) {
      await prisma.carouselItem.create({ data: product });
    }
    console.log('✅ Carousel items created:', products.length, 'items');

    // 4. Create Instagram posts
    console.log('\nCreating Instagram posts...');
    const igPosts = [
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/544nkx7t_1000095366.jpg',
        postUrl: 'https://www.instagram.com/p/DDgLNyGTXA3/?igsh=NTQ4Ymt3Mnpoejcw',
        sortOrder: 1
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/d17pg0bx_1000095368.jpg',
        postUrl: 'https://www.instagram.com/p/DDgLCIKzoOd/?igsh=MTJrYzlobGExajkxbg==',
        sortOrder: 2
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/irc3cc6p_1000095370.jpg',
        postUrl: 'https://www.instagram.com/p/C91F9KRynmA/?igsh=MWVqejZ2b245YjQ0Yg==',
        sortOrder: 3
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/9pjxlw2j_1000095372.jpg',
        postUrl: 'https://www.instagram.com/p/C9WDqvMSasE/?igsh=ZHFkeGJmdHR5ZTA0',
        sortOrder: 4
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/9ugrdp2x_1000095408.jpg',
        postUrl: 'https://www.instagram.com/p/C8-5-5VSR_9/?igsh=MWlqejhjcTF6Ynp5eg==',
        sortOrder: 5
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/cxcesgk5_1000095410.jpg',
        postUrl: 'https://www.instagram.com/p/C88mpfiJ6uQ/?igsh=eDZqNDNzcXR2bHhz',
        sortOrder: 6
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/igjuvcu8_1000095412.jpg',
        postUrl: 'https://www.instagram.com/p/C8lPrKwyWoh/?igsh=MThyNHdhbjlrY3c5Ng==',
        sortOrder: 7
      },
      {
        imageUrl: 'https://customer-assets.emergentagent.com/job_011ff852-75a2-47b2-bc91-fdd49afc6e66/artifacts/wnssurew_1000095414.jpg',
        postUrl: 'https://www.instagram.com/p/C72_qaSJ_uL/?igsh=ZHZzYWVuc2FjbzBk',
        sortOrder: 8
      }
    ];

    for (const post of igPosts) {
      await prisma.instagramPost.create({ data: post });
    }
    console.log('✅ Instagram posts created:', igPosts.length, 'items');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Admin credentials:');
    console.log('   Email: admin@gudangpancing.com');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
