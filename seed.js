const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gadgethub';

const sampleGadgets = [
  {
    name: 'Samsung Galaxy A56 5G Mobile (Awesome Midnight Blue, 8GB, 128GB)',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 31999,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Segment Most Complete Triple Camera | 50MP | AI Editing | 4nm Processor | sAMOLED | 5000mAh | Gorilla Glass Victus+ | Knox Security | 5 Gen OS Upgrades.',
    specs: {
      Display: '6.7-inch Super AMOLED FHD+ 120Hz (1600 nits)',
      Processor: 'Exynos 1580 (4nm Octa-Core)',
      Camera: '50MP OIS Main + 12MP Ultra-Wide + 5MP Macro with AI Photo Assist',
      Battery: '5000 mAh with 45W Super Fast Charging',
      Durability: 'Corning Gorilla Glass Victus+ with IP67 Water & Dust Resistance',
      Security: 'Samsung Knox Vault & 5 Generations of OS Upgrades'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Priya Sen (Amazon Verified Purchase)',
        rating: 5,
        comment: 'Segment best camera! The 50MP sensor with AI Editing cleans up background photobombers effortlessly. Battery lasts 1.5 days easily on 5G.'
      },
      {
        reviewerName: 'Rohit Sharma (Verified Buyer)',
        rating: 4,
        comment: 'Gorilla Glass Victus+ gives premium peace of mind. Very smooth 120Hz sAMOLED display with punchy colors. Great Festival deal at ₹31,999!'
      },
      {
        reviewerName: 'Arindam Ghosh (Kolkata Tech Forum)',
        rating: 5,
        comment: 'The 4nm chip stays cool even during gaming and heavy multitasking. Outstanding value for money.'
      }
    ]
  },
  {
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Smartphones',
    price: 149900,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048133021-3965a396e95a?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and 5x optical zoom camera system.',
    specs: {
      Display: '6.7-inch Super Retina XDR OLED 120Hz',
      Processor: 'Apple A17 Pro (3nm)',
      Storage: '256GB NVMe',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto',
      Battery: '4422 mAh with MagSafe Charging'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Alex Chen (Verified Amazon Buyer)',
        rating: 5,
        comment: 'The titanium frame feels noticeably lighter than previous generations. Outstanding 5x optical zoom and battery lasts all day.'
      },
      {
        reviewerName: 'Sarah Jenkins (MacRumors Tech Lead)',
        rating: 4,
        comment: 'Great battery life and blazing fast processor. USB-C is a welcome upgrade for fast SSD data transfers.'
      }
    ]
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    category: 'Laptops',
    price: 349900,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'The most advanced Mac laptop for demanding workflows. Powered by the M3 Max chip with 16-core CPU and 40-core GPU.',
    specs: {
      Display: '16.2-inch Liquid Retina XDR (3456 x 2234)',
      Processor: 'Apple M3 Max (16-core CPU, 40-core GPU)',
      Memory: '48GB Unified Memory',
      Storage: '1TB Superfast SSD',
      BatteryLife: 'Up to 22 hours playback'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'David Miller (Reddit r/apple Tech Lead)',
        rating: 5,
        comment: 'Handles 8K video editing and Docker containers without breaking a sweat or turning on the fans. The Liquid Retina display is breathtaking.'
      }
    ]
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Audio',
    price: 29990,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Industry-leading noise canceling with two processors and eight microphones for unprecedented sound purity and call quality.',
    specs: {
      Driver: '30mm carbon fiber composite',
      NoiseCancellation: 'Active NC with Auto NC Optimizer',
      BatteryLife: '30 hours with NC on',
      Connectivity: 'Bluetooth 5.2, Multipoint, 3.5mm Aux',
      Weight: '250 grams'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Emily Watson (Head-Fi Audio Forum)',
        rating: 5,
        comment: 'Best noise cancellation on long flights. Super lightweight and comfortable to wear for hours on end.'
      },
      {
        reviewerName: 'Rohan Sharma (Amazon Verified Customer)',
        rating: 4,
        comment: 'Microphone clarity in Zoom meetings is top-notch. Love the touch controls and instant device switching.'
      }
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 129999,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Meet Galaxy S24 Ultra with Galaxy AI, titanium shield exterior, integrated S Pen stylus, and 200MP camera.',
    specs: {
      Display: '6.8-inch Dynamic AMOLED 2X, 2600 nits',
      Processor: 'Snapdragon 8 Gen 3 for Galaxy',
      Storage: '512GB UFS 4.0',
      RAM: '12GB LPDDR5X',
      Stylus: 'Embedded S Pen with Bluetooth gestures'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Marcus Vance (XDA Developers Editor)',
        rating: 5,
        comment: 'The anti-reflective screen is revolutionary in bright daylight. The AI live translate feature works like magic.'
      }
    ]
  },
  {
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'Wearables',
    price: 89900,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'The ultimate sports and adventure watch. 49mm aerospace-grade titanium case, 3000-nit display, and dual-frequency GPS.',
    specs: {
      Case: '49mm Titanium with Sapphire crystal',
      WaterResistance: '100m water resistant & 40m recreational dive',
      Battery: 'Up to 36 hours normal use (72h Low Power)',
      Sensors: 'ECG, Blood Oxygen, Depth gauge, Siren'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Liam O’Connor (Outdoor Gear Weekly)',
        rating: 5,
        comment: 'Survived rugged mountain hiking and ocean surfing. The battery easily lasts a full weekend with dual-frequency GPS.'
      }
    ]
  },
  {
    name: 'ASUS ROG Ally Z1 Extreme',
    brand: 'ASUS',
    category: 'Gaming',
    price: 69990,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Handheld Windows 11 gaming console powered by AMD Ryzen Z1 Extreme processor and 120Hz Full HD display.',
    specs: {
      Processor: 'AMD Ryzen Z1 Extreme (8 cores, 16 threads)',
      Graphics: 'AMD Radeon Graphics (RDNA 3)',
      Display: '7-inch FHD (1920 x 1080) 120Hz FreeSync Premium',
      Storage: '512GB PCIe 4.0 NVMe M.2 SSD'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Chris Evans (Reddit r/HandheldGaming)',
        rating: 4,
        comment: 'Plays AAA Steam games on the couch smoothly. Windows 11 gives full access to Xbox Game Pass and emulator libraries.'
      }
    ]
  },
  {
    name: 'iPad Pro 13" M4 OLED',
    brand: 'Apple',
    category: 'Accessories',
    price: 129900,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'The thinnest Apple product ever. Featuring the revolutionary Ultra Retina XDR tandem OLED display and the breakthrough M4 chip.',
    specs: {
      Display: '13-inch Ultra Retina XDR Tandem OLED (1600 nits peak)',
      Processor: 'Apple M4 chip with 16-core Neural Engine',
      Thickness: '5.1 mm ultra-thin enclosure',
      Storage: '256GB NVMe SSD'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Aarav Patel (Procreate Beta Artist)',
        rating: 5,
        comment: 'The Tandem OLED screen has pitch-perfect blacks and insane contrast for pro art and video color grading.'
      }
    ]
  },
  {
    name: 'PlayStation 5 Slim Console',
    brand: 'Sony',
    category: 'Gaming',
    price: 54990,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and all-new slim design.',
    specs: {
      Storage: '1TB Custom High-Speed SSD (5.5 GB/s)',
      Resolution: '4K 120Hz gaming with Ray Tracing support',
      Audio: 'Tempest 3D AudioTech',
      Controller: 'DualSense Wireless Controller included'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Kunal Verma (IGN India Gaming)',
        rating: 5,
        comment: 'Loads games like Spider-Man 2 in less than 2 seconds. The slim form factor takes up much less desk space.'
      },
      {
        reviewerName: 'Priya Sen (Amazon Verified Purchase)',
        rating: 5,
        comment: 'The DualSense haptics and adaptive triggers make racing games feel unreal.'
      }
    ]
  },
  {
    name: 'Dell XPS 15 3.5K OLED',
    brand: 'Dell',
    category: 'Laptops',
    price: 189990,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'High-performance laptop crafted with machined aluminum and carbon fiber palm rest, powered by Intel Core i9 and RTX 4070.',
    specs: {
      Display: '15.6-inch 3.5K (3456x2160) InfinityEdge OLED Touch',
      Processor: 'Intel Core i9-13900H (14 cores, up to 5.4 GHz)',
      Graphics: 'NVIDIA GeForce RTX 4070 (8GB GDDR6)',
      RAM: '32GB DDR5 4800MHz Dual Channel'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Vikram Joshi (Blender Artists Community)',
        rating: 4,
        comment: 'Outstanding display and keyboard. Easily renders Blender models and 4K footage without hesitation.'
      }
    ]
  },
  {
    name: 'AirPods Pro (2nd Gen, USB-C)',
    brand: 'Apple',
    category: 'Audio',
    price: 24900,
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Up to 2x more active noise cancellation, Adaptive Audio, Conversation Awareness, and dust/sweat resistance with USB-C case.',
    specs: {
      Chip: 'Apple H2 Headphone chip & U1 in case',
      NoiseCancellation: '2x improved Active NC with Adaptive Transparency',
      AudioTech: 'Personalized Spatial Audio with dynamic head tracking',
      Case: 'MagSafe Charging Case (USB-C) with speaker & lanyard loop'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Sneha Nair (Audiophile Club India)',
        rating: 5,
        comment: 'Conversation Awareness automatically drops volume when I speak. Super convenient for office work.'
      }
    ]
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'Smartphones',
    price: 106999,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered by Google with Tensor G3 chip, cutting-edge AI camera features, polished aluminum frame, and matte back glass.',
    specs: {
      Display: '6.7-inch Super Actua LTPO OLED (1-120Hz, 2400 nits)',
      Processor: 'Google Tensor G3 with Titan M2 security coprocessor',
      CameraSystem: '50MP Main + 48MP Ultrawide with Macro + 48MP 5x Telephoto',
      AI_Features: 'Best Take, Audio Magic Eraser, Magic Editor, Call Screen'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Ritu Menon (Google Pixel User Group)',
        rating: 5,
        comment: 'Night Sight and portrait modes are unmatched. Pure stock Android software experience is buttery smooth.'
      }
    ]
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    category: 'Accessories',
    price: 10995,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1626218174358-7769486c4b79?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'An iconic performance mouse remastered with Quiet Clicks, 8K DPI tracking that works on glass, and MagSpeed electromagnetic scrolling.',
    specs: {
      Sensor: 'Darkfield 8000 DPI high precision (tracks on glass surfaces)',
      ScrollWheel: 'MagSpeed Electromagnetic wheel (1,000 lines per second)',
      QuietClicks: '90% click noise reduction compared to Master 3',
      Battery: 'Up to 70 days on full charge, 3 hours from 1-min quick charge'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Aditya Rao (Reddit r/MechanicalKeyboards)',
        rating: 5,
        comment: 'The MagSpeed scroll wheel and thumb gestures make navigating large Excel spreadsheets and codebases a breeze.'
      }
    ]
  },
  {
    name: 'Nintendo Switch OLED Model',
    brand: 'Nintendo',
    category: 'Gaming',
    price: 31999,
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612287232737-0b5c1653ff49?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&auto=format&fit=crop&q=80'
    ],
    description: 'Versatile hybrid gaming system with vibrant 7-inch OLED screen, wide adjustable stand, dock with wired LAN port, and 64GB storage.',
    specs: {
      Display: '7.0-inch multi-touch capacitive OLED screen (720p handheld / 1080p TV)',
      Modes: 'TV Mode, Tabletop Mode, Handheld Mode',
      Storage: '64GB internal storage (microSD card slot up to 2TB)',
      Speakers: 'Enhanced audio in handheld and tabletop modes'
    },
    inStock: true,
    reviews: [
      {
        reviewerName: 'Devansh Kulkarni (Nintendo Life Forum)',
        rating: 4,
        comment: 'Zelda Tears of the Kingdom looks incredible on the OLED screen. Perfect handheld for casual and family gaming.'
      }
    ]
  }
];

async function seedDB() {
  try {
    console.log('🔄 Connecting to MongoDB to seed initial gadget data...');
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log(' Cleaned existing products');

    // Calculate initial average ratings
    const gadgetsWithRatings = sampleGadgets.map((gadget) => {
      let avgRating = 0;
      if (gadget.reviews && gadget.reviews.length > 0) {
        const total = gadget.reviews.reduce((acc, r) => acc + r.rating, 0);
        avgRating = parseFloat((total / gadget.reviews.length).toFixed(1));
      }
      return { ...gadget, avgRating };
    });

    // Insert sample data
    const inserted = await Product.insertMany(gadgetsWithRatings);
    console.log(`🎉 Successfully seeded ${inserted.length} gadgets with embedded NoSQL reviews into database "gadgethub"!`);

    // Clear and seed demo accounts
    await User.deleteMany({});
    console.log(' Cleaned existing users');

    const demoUser = new User({
      name: 'Priya Sen',
      email: 'priya@gadgethub.com',
      password: 'password123',
      phone: '+91 98450 12345',
      address: 'Flat 4B, Green Meadows, Indiranagar, Bengaluru, Karnataka 560038',
      role: 'customer',
      orders: [
        {
          orderId: 'ORD-782194',
          items: [
            {
              productId: inserted[0]._id.toString(),
              name: inserted[0].name,
              price: inserted[0].price,
              imageUrl: inserted[0].imageUrl,
              category: inserted[0].category,
              quantity: 1
            }
          ],
          totalAmount: 31999,
          shippingAddress: 'Flat 4B, Green Meadows, Indiranagar, Bengaluru, Karnataka 560038',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          orderId: 'ORD-651042',
          items: [
            {
              productId: inserted[3]._id.toString(),
              name: inserted[3].name,
              price: inserted[3].price,
              imageUrl: inserted[3].imageUrl,
              category: inserted[3].category,
              quantity: 1
            }
          ],
          totalAmount: 29990,
          shippingAddress: 'Flat 4B, Green Meadows, Indiranagar, Bengaluru, Karnataka 560038',
          status: 'Shipped',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    });
    await demoUser.save();
    console.log('👤 Created demo user: priya@gadgethub.com (password: password123) with 2 embedded NoSQL orders');

    console.log(' You can now open MongoDB Compass and inspect the "gadgethub" database.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seedDB();
