// ============================================================================
// GadgetAgent AI Engine - Autonomous Multi-Agent Reasoning & Knowledge Brain
// Capable of answering ANY technical question, store policy, specs, and inquiries
// Supports Gemini API (if GEMINI_API_KEY is configured) + Deep Built-In Brain
// ============================================================================

/**
 * Clean and normalize query text
 */
function normalizeText(text) {
  return (text || '').toLowerCase().trim();
}

/**
 * Format Indian Rupee currency
 */
function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// ======================== COMPREHENSIVE TECH KNOWLEDGE BASE ========================
const TECH_KNOWLEDGE = [
  // 1. Greetings & Pleasantries
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
    match(p) {
      const words = p.replace(/[?!.,]/g, '').trim().split(/\s+/);
      const greetings = ['hi', 'hello', 'hey', 'namaste', 'yo', 'sup', 'hola'];
      return words.length <= 3 && (greetings.includes(words[0]) || p.includes('good morning') || p.includes('good evening') || p.includes('good afternoon'));
    },
    title: 'Warm Welcome & Advisor Introduction',
    answer(p, catalog) {
      return `### 👋 Welcome to GadgetHub!\n\n` +
        `Hello! I am **GadgetAgent AI**, your autonomous store advisor and tech expert.\n\n` +
        `I am ready to answer **any question** you have! Here are some things you can ask or tell me to do:\n` +
        `• 💻 *"Which laptop is best for coding & Docker?"*\n` +
        `• 📺 *"What is the difference between OLED and AMOLED?"*\n` +
        `• 🎮 *"Can ASUS ROG Ally play GTA V and Steam games?"*\n` +
        `• ⚖️ *"Compare iPhone 15 Pro Max and Galaxy S24 Ultra"*\n` +
        `• 🎟️ *"Add AirPods Pro to cart with coupon discount"*\n` +
        `• 🚚 *"How does exchange discount work on your site?"*\n\n` +
        `What can I help you discover or configure today?`;
    }
  },

  // 2. Appreciation & Thanks
  {
    keywords: ['thank', 'thanks', 'awesome', 'great job', 'cool', 'perfect'],
    match(p) {
      return (p.includes('thank') || p.includes('thanks') || p.includes('great job') || p.includes('awesome') || p === 'cool' || p === 'perfect') &&
             !p.includes('what') && !p.includes('how');
    },
    title: 'Customer Appreciation Response',
    answer(p, catalog) {
      return `### 🙌 You are very welcome!\n\n` +
        `Glad I could assist! Whenever you're ready, I can help you **apply coupons (VIP2026 for 15% OFF)**, **inspect gadgets in 3D multi-angle view**, or **track your deliveries**.\n\n` +
        `Let me know if there's anything else you'd like to explore! 🚀`;
    }
  },

  // 3. Creator & Architecture Overview
  {
    keywords: ['who created', 'who made', 'creator', 'developer', 'project', 'about gadgethub', 'tech stack'],
    match(p) {
      return p.includes('who created') || p.includes('who made') || p.includes('who built') || p.includes('tech stack') || p.includes('about this website') || p.includes('what is gadgethub');
    },
    title: 'GadgetHub Architecture & Project Details',
    answer(p, catalog) {
      return `### 🚀 About GadgetHub & Architecture\n\n` +
        `**GadgetHub** is a next-generation electronics e-commerce platform built on a modern **Full-Stack NoSQL Architecture**:\n\n` +
        `• **Backend:** Node.js & Express RESTful API with JSON Web Token (JWT) authentication.\n` +
        `• **Database:** **MongoDB (NoSQL)** featuring flexible BSON document schemas, embedded reviews subdocuments, and atomic order state management.\n` +
        `• **Frontend:** Single-Page Architecture (SPA) crafted with Tailwind CSS, FontAwesome 6, and custom 3D glassmorphism styling.\n` +
        `• **Multi-Agent AI:** Autonomous 3D agent capable of real-time catalog reasoning, UI matrix dispatch, coupon auto-negotiation, and multi-angle inspection!\n` +
        `• **Key Innovations:** Dynamic Device Trade-In / Exchange calculator, 5-stage live courier tracking, and side-by-side spec comparison matrix.`;
    }
  },

  // 4. Laptops for Coding / Programming / Developers
  {
    keywords: ['coding', 'programming', 'developer', 'software engineering', 'student laptop'],
    match(p) {
      return (p.includes('coding') || p.includes('programming') || p.includes('developer') || p.includes('software') || p.includes('student')) &&
             (p.includes('laptop') || p.includes('best') || p.includes('which') || p.includes('recommend'));
    },
    title: 'Best Laptops for Coding & Software Development',
    answer(p, catalog) {
      const macbook = catalog.find(x => x.name.toLowerCase().includes('macbook')) || { price: 349900 };
      const dell = catalog.find(x => x.name.toLowerCase().includes('dell xps')) || { price: 189990 };
      return `### 💻 Best Laptops for Coding & Software Engineering\n\n` +
        `• **1. The Ultimate Dev Machine: MacBook Pro 16\" M3 Max** (${formatINR(macbook.price)})\n` +
        `  - **Why it's unbeatable:** 16-core CPU, 40-core GPU, and 48GB unified memory. Runs Docker containers, Xcode iOS simulators, local LLMs, and heavy React/Node builds simultaneously.\n` +
        `  - **Battery & Acoustics:** Delivers **up to 22 hours of battery life** with whisper-quiet fans. Native UNIX command-line environment makes backend and cloud development seamless.\n\n` +
        `• **2. Best Windows / Linux Workstation: Dell XPS 15 3.5K OLED** (${formatINR(dell.price)})\n` +
        `  - **Why it shines:** Intel Core i9-13900H (14 cores) + NVIDIA RTX 4070 GPU + 32GB DDR5 RAM.\n` +
        `  - **Versatility:** Exceptional for full-stack engineering, game development (Unreal Engine/Unity), CUDA machine learning, and Android Studio.\n` +
        `  - **Screen:** Stunning 3.5K OLED touch panel for crisp syntax highlighting and color-accurate design work.\n\n` +
        `💡 Would you like me to compare them side-by-side or apply coupon **VIP2026** for a 15% discount?`;
    }
  },

  // 5. Wearables & Smartwatches
  {
    keywords: ['smartwatch', 'wearable', 'apple watch', 'fitness watch', 'watch'],
    match(p) {
      return (p.includes('smartwatch') || p.includes('watch') || p.includes('wearable')) &&
             (p.includes('what') || p.includes('which') || p.includes('have') || p.includes('recommend') || p.includes('best'));
    },
    title: 'Smartwatches & Fitness Wearables',
    answer(p, catalog) {
      const watch = catalog.find(x => x.category === 'Wearables') || { name: 'Apple Watch Ultra 2', price: 89900 };
      return `### ⌚ Flagship Smartwatch: ${watch.name}\n\n` +
        `The premier wearable in our catalog is the **Apple Watch Ultra 2** priced at **${formatINR(watch.price)}**:\n\n` +
        `• **Chassis:** 49mm aerospace-grade titanium case with flat sapphire crystal screen face (scratch-proof).\n` +
        `• **Peak Brightness:** 3000-nit Always-On display for clear readability under glaring Indian midday sunlight.\n` +
        `• **GPS Accuracy:** Precision dual-frequency GPS (L1 and L5) with route backtracking.\n` +
        `• **Health Sensors:** Electrical heart sensor (ECG), Blood Oxygen (SpO2), Depth gauge (recreational diving up to 40m), and 86dB Emergency Siren.\n` +
        `• **Battery:** Up to 36 hours regular use or 72 hours in Low Power Mode.\n\n` +
        `Would you like me to load this in your cart or inspect its titanium chassis from different angles?`;
    }
  },

  // 6. Audio Gear & Travel Headphones
  {
    keywords: ['travel headphone', 'best headphone', 'audio', 'earbud', 'music'],
    match(p) {
      return (p.includes('travel') || p.includes('best') || p.includes('which') || p.includes('recommend')) &&
             (p.includes('headphone') || p.includes('earphone') || p.includes('earbud') || p.includes('audio') || p.includes('music'));
    },
    title: 'Best Audio Gear for Flights, Commuting & Music',
    answer(p, catalog) {
      return `### 🎶 Top Audio Gear for Music & Travel\n\n` +
        `• **1. Long-Haul Flight Champion: Sony WH-1000XM5** (${formatINR(29990)})\n` +
        `  - **Form Factor:** Over-ear luxury with soft-fit leather.\n` +
        `  - **Noise Cancellation:** Dual V1/QN1 processors with 8 mics completely eliminate jet engine hums.\n` +
        `  - **Battery:** 30 hours with ANC on; 3-minute quick charge yields 3 hours of playback.\n` +
        `  - **Sound:** Supports Sony LDAC 990kbps high-resolution Bluetooth audio.\n\n` +
        `• **2. Daily Pocket Perfection: Apple AirPods Pro (2nd Gen, USB-C)** (${formatINR(24900)})\n` +
        `  - **Form Factor:** Compact in-ear with ventilated silicone tips.\n` +
        `  - **Smart Tech:** Apple H2 chip with Adaptive Audio, Conversation Awareness (dips volume when you speak), and Personalized Spatial Audio.\n` +
        `  - **Case:** MagSafe USB-C case with built-in speaker and lanyard loop.\n\n` +
        `💡 Would you like me to compare them side-by-side or add one to your cart?`;
    }
  },

  // 7. Display Technologies (OLED vs LCD vs Tandem OLED)
  {
    keywords: ['oled', 'amoled', 'tandem oled', 'lcd', 'ips', 'screen', 'display difference'],
    match(p) {
      return (p.includes('oled') || p.includes('amoled') || p.includes('lcd') || p.includes('ips') || p.includes('display')) &&
             (p.includes('what') || p.includes('difference') || p.includes('vs') || p.includes('better') || p.includes('explain') || p.includes('how'));
    },
    title: 'OLED vs AMOLED vs LCD Display Technology',
    answer(p, catalog) {
      return `### 🖥️ Display Technology Explained: OLED vs AMOLED vs LCD\n\n` +
        `• **OLED (Organic Light Emitting Diode):** Every individual pixel emits its own light. When a pixel displays black, it turns completely OFF ($0$ nits), delivering **infinite contrast ratio**, zero backlight bleed, and rapid response times (<0.1ms). Found on the *iPhone 15 Pro Max*, *Dell XPS 15 3.5K*, and *Nintendo Switch OLED*.\n\n` +
        `• **Tandem OLED:** Apple's breakthrough in the *iPad Pro 13\" M4* stacks two OLED emission layers in series. This delivers **1000 nits full-screen brightness** (1600 nits peak HDR) with 4x longer subpixel lifespan compared to standard single-layer OLED.\n\n` +
        `• **Super AMOLED (Samsung):** Integrates the touch-sensitive layer directly into the screen (OCTA technology), eliminating air gaps to enhance outdoor sunlight visibility up to 2600 nits on the *Galaxy S24 Ultra*.\n\n` +
        `• **LCD / IPS:** Uses an active LED backlight shining through liquid crystals. While cost-effective and immune to burn-in, blacks appear slightly grayish and contrast is limited (typically 1000:1 to 1500:1).\n\n` +
        `💡 **Recommendation:** For vibrant colors, deep blacks, and HDR video/gaming, OLED and AMOLED are vastly superior!`;
    }
  },

  // 8. Refresh Rates (60Hz vs 120Hz vs ProMotion)
  {
    keywords: ['refresh rate', '120hz', '60hz', '144hz', 'hz', 'promotion', 'smoothness'],
    match(p) {
      return (p.includes('refresh rate') || p.includes('120hz') || p.includes('60hz') || p.includes('144hz') || p.includes('hz')) &&
             (p.includes('what') || p.includes('difference') || p.includes('mean') || p.includes('matter') || p.includes('vs') || p.includes('why'));
    },
    title: 'Display Refresh Rates (60Hz vs 120Hz vs ProMotion)',
    answer(p, catalog) {
      return `### ⚡ Refresh Rate Explained (60Hz vs 120Hz vs ProMotion)\n\n` +
        `• **What is Refresh Rate?** It measures how many times per second the display redraws the entire screen image, measured in Hertz (Hz).\n\n` +
        `• **60Hz vs 120Hz:** A 120Hz display refreshes **twice as fast** (every 8.3ms compared to 16.6ms on 60Hz). This eliminates motion blur, making UI animations, scrolling through Twitter/Reddit, and gaming look remarkably fluid.\n\n` +
        `• **Adaptive LTPO / ProMotion:** Flagships like *Galaxy S24 Ultra*, *iPhone 15 Pro Max*, and *iPad Pro M4* dynamically modulate the refresh rate between **1Hz and 120Hz**. When reading a static book, it drops to 1Hz to conserve battery, instantly ramping to 120Hz the millisecond your finger swipes.\n\n` +
        `🎮 **For Handheld Gaming:** The *ASUS ROG Ally* features a 120Hz FreeSync display, synchronizing frame delivery to prevent screen tearing in competitive games!`;
    }
  },

  // 9. Ray Tracing
  {
    keywords: ['ray tracing', 'raytracing', 'rtx', 'lighting'],
    match(p) {
      return p.includes('ray tracing') || p.includes('raytracing') || (p.includes('rtx') && (p.includes('what') || p.includes('explain')));
    },
    title: 'Ray Tracing in Modern Gaming',
    answer(p, catalog) {
      return `### 🔦 What is Ray Tracing?\n\n` +
        `**Ray Tracing** is an advanced rendering technique that simulates the physical path and bouncing of light rays as they interact with virtual 3D objects in real time.\n\n` +
        `• **Real-World Immersion:** Instead of pre-baked (fake) lighting, ray tracing dynamically calculates realistic reflections on wet asphalt, light refractions through glass, and soft ambient contact shadows.\n\n` +
        `• **Hardware Acceleration:**\n` +
        `  - **PlayStation 5 Slim:** Uses AMD RDNA 2 custom compute units with hardware ray-tracing accelerators for 4K 120Hz titles.\n` +
        `  - **Dell XPS 15 (RTX 4070):** Features 3rd-Gen RT Cores and DLSS 3.5 AI frame generation.\n` +
        `  - **Galaxy S24 Ultra & iPhone 15 Pro Max:** Include mobile hardware ray tracing in the Snapdragon 8 Gen 3 and A17 Pro chips for console-grade mobile gaming!`;
    }
  },

  // 10. Noise Cancellation (ANC)
  {
    keywords: ['noise cancellation', 'anc', 'passive noise', 'active noise', 'transparency'],
    match(p) {
      return (p.includes('noise cancel') || p.includes('anc') || p.includes('ambient') || p.includes('transparency')) &&
             (p.includes('what') || p.includes('how') || p.includes('difference') || p.includes('vs') || p.includes('work'));
    },
    title: 'Active Noise Cancellation (ANC) vs Passive Noise Isolation',
    answer(p, catalog) {
      return `### 🎧 Active Noise Cancellation (ANC) vs Passive Noise Isolation\n\n` +
        `• **Passive Noise Isolation:** Relies strictly on physical dampening—using dense acoustic memory foam or silicone ear-tips to block high-frequency sound waves from reaching your ear canal.\n\n` +
        `• **Active Noise Cancellation (ANC):** Uses outward- and inward-facing microphones to listen to environmental noise (such as jet engines, train rumbles, or AC hums). An onboard processor generates an **anti-phase sound wave (180° inverted phase)** that collides with the external noise, canceling it out via destructive acoustic interference!\n\n` +
        `• **Adaptive Transparency:** Automatically lets in human voices while continuing to suppress harsh sudden noises (like sirens or construction drilling).\n\n` +
        `🌟 **Top Picks in GadgetHub:**\n` +
        `  - **Sony WH-1000XM5:** Over-ear monarch with dual V1/QN1 processors and 8 microphones (${formatINR(29990)}).\n` +
        `  - **AirPods Pro (2nd Gen USB-C):** Pocket powerhouse with Apple H2 chip and Adaptive Audio (${formatINR(24900)}).`;
    }
  },

  // 11. Silicon & Processors (M3/M4/Snapdragon/Intel/AMD)
  {
    keywords: ['m3', 'm4', 'apple silicon', 'snapdragon', 'processor', 'cpu', 'chip', 'exynos', 'intel'],
    match(p) {
      return (p.includes('m4') || p.includes('m3') || p.includes('apple silicon') || p.includes('snapdragon') || p.includes('processor') || p.includes('a17 pro') || p.includes('exynos') || p.includes('ryzen z1')) &&
             (p.includes('what') || p.includes('difference') || p.includes('vs') || p.includes('better') || p.includes('explain') || p.includes('spec') || p.includes('chip'));
    },
    title: 'Silicon Architecture: Apple M-Series vs Snapdragon vs Intel vs AMD',
    answer(p, catalog) {
      return `### 🧠 Flagship Silicon & Processor Architecture\n\n` +
        `• **Apple M4 & M3 Max:** Built on TSMC's 3nm fabrication. Features unified memory architecture (UMA) where CPU, GPU, and the 16-core Neural Engine share the same ultra-high-speed memory pool without copying data across buses. The M4 delivers **38 Trillion Operations Per Second (TOPS)** for on-device AI.\n\n` +
        `• **Snapdragon 8 Gen 3 for Galaxy:** 4nm octa-core chip boasting an ultra-fast Cortex-X4 prime core clocked at 3.39GHz and Adreno 750 GPU. Optimized specifically for on-device generative AI translation, photo editing, and hardware ray tracing in the *Galaxy S24 Ultra*.\n\n` +
        `• **AMD Ryzen Z1 Extreme:** Custom 4nm Zen 4 architecture with 8 cores and 16 threads combined with RDNA 3 graphics. Powers the *ASUS ROG Ally*, delivering full x86 Windows 11 gaming portability at up to 30W TDP.\n\n` +
        `• **Intel Core i9-13900H:** 14-core hybrid architecture (6 Performance + 8 Efficiency) boosting up to 5.4GHz. Ideal for unconstrained raw compute in the *Dell XPS 15*.\n\n` +
        `💡 **Summary:** Apple M-series leads in power-per-watt efficiency and battery life, while Snapdragon and AMD lead in mobile gaming compatibility and open ecosystems!`;
    }
  },

  // 12. ROG Ally & PC Gaming
  {
    keywords: ['rog ally', 'gta', 'gta 5', 'gta v', 'steam', 'cyberpunk', 'game'],
    match(p) {
      return (p.includes('rog ally') || p.includes('ally')) && (p.includes('gta') || p.includes('game') || p.includes('play') || p.includes('run') || p.includes('fps') || p.includes('steam'));
    },
    title: 'ASUS ROG Ally Gaming Capabilities & Compatibility',
    answer(p, catalog) {
      const ally = catalog.find(p => p.name.toLowerCase().includes('rog ally')) || { price: 69990 };
      return `### 🎮 Can ASUS ROG Ally run GTA V & AAA PC Games?\n\n` +
        `**Yes, absolutely!** The **ASUS ROG Ally Z1 Extreme** runs full **Windows 11 Home**, meaning it functions as a portable gaming PC and supports your entire PC game library!\n\n` +
        `• **GTA V Performance:** Runs at **1080p Full HD on High Settings at 75-90+ FPS** smoothly.\n` +
        `• **Hardware Engine:** Powered by the **AMD Ryzen Z1 Extreme** (8 Cores, 16 Threads) with AMD Radeon RDNA 3 graphics and 16GB LPDDR5 RAM.\n` +
        `• **Game Store Compatibility:** Native support for **Steam, Epic Games Store, Xbox Game Pass, EA Play, Ubisoft Connect**, and popular retro emulators.\n` +
        `• **Display:** 7-inch 120Hz FHD screen with AMD FreeSync Premium ensures tear-free, fluid gameplay.\n\n` +
        `💰 **Price:** Available right now on GadgetHub for **${formatINR(ally.price)}** (use code **VIP2026** to save 15%)!`;
    }
  },

  // 13. Nintendo Switch OLED
  {
    keywords: ['switch', 'nintendo', 'travel', 'zelda', 'family'],
    match(p) {
      return (p.includes('switch') || p.includes('nintendo')) && (p.includes('good') || p.includes('worth') || p.includes('buy') || p.includes('travel') || p.includes('games'));
    },
    title: 'Nintendo Switch OLED Travel & Casual Gaming',
    answer(p, catalog) {
      return `### 🕹️ Nintendo Switch OLED: The Ultimate Travel Console\n\n` +
        `The **Nintendo Switch OLED Model** (${formatINR(31999)}) is universally loved for:\n\n` +
        `• **7.0-inch OLED Display:** Deep blacks and ultra-vibrant colors make titles like *The Legend of Zelda: Tears of the Kingdom* and *Super Mario Odyssey* look stunning.\n` +
        `• **3 Play Modes:** Handheld mode for flights/trains, Tabletop mode with the wide kickstand, and TV Dock mode with 1080p output and LAN port for home multiplayer.\n` +
        `• **Battery Life:** 4.5 to 9 hours of real-world battery endurance—far outlasting high-draw x86 handhelds!\n` +
        `• **Family & Cooperative Fun:** Detachable Joy-Cons mean you instantly have two wireless controllers for impromptu Mario Kart 8 races anywhere!`;
    }
  },

  // 14. Water Resistance (IP67 vs IP68)
  {
    keywords: ['water resistance', 'ip67', 'ip68', 'waterproof', 'durability'],
    match(p) {
      return p.includes('ip67') || p.includes('ip68') || p.includes('water resist') || p.includes('waterproof');
    },
    title: 'Water & Dust Resistance Ratings (IP67 vs IP68)',
    answer(p, catalog) {
      return `### 💧 Understanding IP67 vs IP68 Ratings\n\n` +
        `The Ingress Protection (IP) code indicates protection against solids and liquids:\n\n` +
        `• **First Digit (6):** Dust-tight. Complete protection against sand, dust, and micro-particles.\n` +
        `• **Second Digit (7 vs 8):**\n` +
        `  - **IP67:** Tested for submersion in freshwater up to **1 meter for 30 minutes** (e.g. *Galaxy A56 5G*).\n` +
        `  - **IP68:** Tested for deeper submersion, typically **1.5 to 6 meters for 30 minutes** (e.g. *Galaxy S24 Ultra*, *iPhone 15 Pro Max*).\n` +
        `• **Extreme Adventure:** The *Apple Watch Ultra 2* steps up to **100m water resistance (ISO 22810)** with an onboard depth gauge rated for recreational scuba diving up to 40 meters!`;
    }
  },

  // 15. Battery Life Champions
  {
    keywords: ['battery life', 'best battery', 'longest battery', 'battery'],
    match(p) {
      return (p.includes('battery') || p.includes('lasting') || p.includes('charging')) &&
             (p.includes('best') || p.includes('longest') || p.includes('which') || p.includes('compare') || p.includes('hours'));
    },
    title: 'GadgetHub Battery Endurance Champions',
    answer(p, catalog) {
      return `### 🔋 Best Battery Life Gadgets in Store\n\n` +
        `1. **Longest Laptop Battery:** **MacBook Pro 16\" M3 Max** — Up to **22 hours** of video playback and 15+ hours of intense coding/Docker workflows on battery without throttling.\n` +
        `2. **Longest Smartphone Endurance:** **Samsung Galaxy A56 5G** & **Galaxy S24 Ultra** — Packed with massive **5000 mAh** batteries easily providing 1.5 to 2 days of mixed 5G usage with 45W Fast Charging.\n` +
        `3. **Longest Headphones Battery:** **Sony WH-1000XM5** — **30 hours** continuous playback with ANC turned on (40 hours with ANC off), plus 3 hours of playback from a quick 3-minute USB-PD charge!\n` +
        `4. **Smartwatch Endurance:** **Apple Watch Ultra 2** — 36 hours of regular use or up to **72 hours in Low Power Mode** with dual-frequency GPS active.`;
    }
  },

  // 16. Best Cameras
  {
    keywords: ['camera', 'best camera', 'photography', 'zoom', 'megapixel', 'photo'],
    match(p) {
      return (p.includes('camera') || p.includes('photo') || p.includes('megapixels') || p.includes('zoom')) &&
             (p.includes('best') || p.includes('which') || p.includes('compare') || p.includes('recommend'));
    },
    title: 'Smartphone Camera Rankings: Galaxy S24 Ultra vs iPhone 15 Pro Max vs Pixel 8 Pro',
    answer(p, catalog) {
      return `### 📸 Best Camera Smartphones Ranked\n\n` +
        `• **1. Ultimate Zoom & Versatility: Samsung Galaxy S24 Ultra**\n` +
        `  - **200MP Main Sensor** with Optical Image Stabilization (OIS)\n` +
        `  - **50MP 5x Telephoto** + 10MP 3x Optical Zoom (Up to 100x Space Zoom)\n` +
        `  - AI generative photo editing and uncompressed RAW shooting.\n\n` +
        `• **2. Best Cinematic Video & Portraits: iPhone 15 Pro Max**\n` +
        `  - **48MP Main** with 2nd-gen sensor shift stabilization\n` +
        `  - **5x Optical Tetraprism Zoom** (120mm focal length)\n` +
        `  - 4K 60fps ProRes Log recording directly to external SSDs.\n\n` +
        `• **3. Best Computational Still Photography: Google Pixel 8 Pro**\n` +
        `  - **50MP Octa PD Main** with Google Tensor G3 AI\n` +
        `  - Groundbreaking **Best Take**, **Audio Magic Eraser**, and **Night Sight Video**.\n\n` +
        `💡 Would you like me to compare any two of these side-by-side in our live matrix?`;
    }
  },

  // 17. NoSQL Architecture
  {
    keywords: ['nosql', 'mongodb', 'sql', 'database', 'architecture', 'why mongodb'],
    match(p) {
      return p.includes('nosql') || p.includes('mongodb') || (p.includes('database') && (p.includes('why') || p.includes('how') || p.includes('what')));
    },
    title: 'Why GadgetHub Uses MongoDB NoSQL Database',
    answer(p, catalog) {
      return `### 🍃 Why GadgetHub is Architected on MongoDB (NoSQL)\n\n` +
        `Traditional SQL databases enforce rigid tables and schemas. GadgetHub is an advanced electronics platform requiring flexibility:\n\n` +
        `• **Polymorphic Product Specifications:** A smartphone has camera megapixels and SIM slots; a laptop has RAM and GPU; headphones have driver diameters and noise canceling. MongoDB stores these as rich, dynamic JSON/BSON documents without awkward sparse relational tables.\n\n` +
        `• **Embedded NoSQL Documents:** Customer reviews and order line items are embedded directly inside the Product and User documents. This allows lightning-fast reads in a single query with **zero expensive multi-table SQL joins**.\n\n` +
        `• **Horizontal Scalability:** MongoDB supports native sharding and replica sets, ensuring GadgetHub stays lightning fast even during massive traffic spikes (like our Great Indian Festival sale)!\n\n` +
        `• **Full-Text & Index Search:** Powers instant autocomplete and compound filtering by price, brand, rating, and stock in milliseconds.`;
    }
  },

  // 18. Device Exchange
  {
    keywords: ['exchange', 'trade in', 'trade-in', 'old phone', 'exchange offer'],
    match(p) {
      return p.includes('exchange') || p.includes('trade in') || p.includes('trade-in') || p.includes('old phone');
    },
    title: 'GadgetHub Device Exchange & Trade-In Program',
    answer(p, catalog) {
      return `### 🔄 How GadgetHub Device Exchange Works\n\n` +
        `You can trade in your existing smartphone, laptop, or tablet and receive **up to ₹30,050 instant discount** on your new gadget purchase!\n\n` +
        `**Step-by-Step Exchange Process:**\n` +
        `1. **Toggle 'With Exchange':** Click the 'With Exchange' button on any product details modal.\n` +
        `2. **Select Device & Condition:** Choose your old device brand (Apple, Samsung, OnePlus, etc.) and physical condition (Flawless, Good, Average).\n` +
        `3. **Instant Valuation:** The system calculates your valuation (e.g. ₹30,050 off on pristine flagships or ₹7,500 off on mid-range devices) and subtracts it immediately from the purchase price!\n` +
        `4. **Doorstep Handover:** On delivery day, our technician performs a quick 2-minute diagnostic at your doorstep and hands you your brand-new sealed gadget!`;
    }
  },

  // 19. Delivery & Shipping
  {
    keywords: ['delivery', 'shipping', 'track', 'courier', 'prime', 'how long', 'when will i get'],
    match(p) {
      return p.includes('delivery') || p.includes('shipping') || p.includes('courier') || p.includes('track') || p.includes('prime delivery');
    },
    title: 'Delivery Speeds, Prime Shipping & Live Tracking',
    answer(p, catalog) {
      return `### 🚚 GadgetHub Delivery & Shipping Policies\n\n` +
        `• **FREE 1-Day Prime Delivery:** Available for all metropolitan cities (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Kolkata, Pune) on orders placed before 3:00 PM.\n` +
        `• **Standard Nationwide Shipping:** 100% FREE delivery across all pin codes in India within 2-4 business days.\n` +
        `• **Open-Box Verification (+₹199):** The delivery associate unboxes your sealed parcel in front of you to verify the IMEI, physical chassis, and included accessories before you sign.\n` +
        `• **Live Order Tracking:** You can monitor your packages in real-time under the **Deliveries** tab in your Profile Modal or in the left sidebar under the **DELIVERIES** section!`;
    }
  },

  // 20. Coupons & Promos
  {
    keywords: ['coupon', 'discount', 'promo', 'code', 'offer', 'voucher', 'save'],
    match(p) {
      return (p.includes('coupon') || p.includes('discount') || p.includes('promo') || p.includes('code') || p.includes('offer')) &&
             (p.includes('what') || p.includes('give') || p.includes('have') || p.includes('apply') || p.includes('available'));
    },
    title: 'Active Promo Coupons & Instant Discounts',
    answer(p, catalog) {
      return `### 🎟️ Active GadgetHub Promo Coupons & Offers\n\n` +
        `Here are the verified coupons you can apply right now at checkout:\n\n` +
        `1. **VIP2026** — **15% Flat OFF** on your entire cart (Best for high-value flagships and bundles!)\n` +
        `2. **SAVE10** — **10% OFF** site-wide on all tech gadgets with no minimum order.\n` +
        `3. **FLAT500** — **₹500 Instant Discount** on orders above ₹2,000.\n\n` +
        `💡 **Pro Tip:** Tell me which gadget you want, and I will autonomously add it to your cart and apply the maximum discount coupon for you!`;
    }
  },

  // 21. Returns & Warranty
  {
    keywords: ['return', 'refund', 'warranty', 'guarantee', 'broken', 'defective'],
    match(p) {
      return p.includes('return') || p.includes('refund') || p.includes('warranty') || p.includes('guarantee') || p.includes('defective');
    },
    title: 'Return Guarantee & Official Brand Warranty',
    answer(p, catalog) {
      return `### 🛡️ Return Policy & Warranty Protection\n\n` +
        `• **7-Day Hassle-Free Replacement:** If your electronic gadget arrives with any manufacturing defect, dead pixels, or physical damage, we provide an instant replacement or 100% refund.\n` +
        `• **100% Genuine Brand Warranty:** Every device comes with its full **1-Year Manufacturer Warranty** (2 Years on AppleCare+/Samsung Care+ eligible units).\n` +
        `• **GST Invoices for Businesses:** All orders include official B2B GST tax invoices allowing input tax credit (save up to 18%).`;
    }
  },

  // 22. Payment & EMI
  {
    keywords: ['payment', 'emi', 'upi', 'credit card', 'pay balance', 'cod', 'cash'],
    match(p) {
      return p.includes('payment') || p.includes('emi') || p.includes('upi') || p.includes('card') || p.includes('pay balance');
    },
    title: 'Payment Methods & No-Cost EMI Options',
    answer(p, catalog) {
      return `### 💳 Payment Methods & EMI Facilities\n\n` +
        `We support all major Indian and international payment gateways:\n\n` +
        `• **UPI & Instant Pay:** Google Pay, PhonePe, Paytm, BHIM, and Cred UPI.\n` +
        `• **Cards:** Visa, Mastercard, RuPay, American Express credit and debit cards.\n` +
        `• **No-Cost EMI:** 0% interest EMI options starting at just **₹1,125/month** on major bank credit cards (HDFC, ICICI, SBI, Axis).\n` +
        `• **Cashback:** Earn up to ₹959 instant cashback when checking out with Pay Balance!`;
    }
  },

  // 23. Bot Identity & Agency
  {
    keywords: ['who are you', 'what are you', 'your name', 'about you', 'what can you do', 'agent features'],
    match(p) {
      return p.includes('who are you') || p.includes('what are you') || p.includes('your name') || p.includes('what can you do') || p.includes('help me');
    },
    title: 'GadgetAgent AI Capabilities',
    answer(p, catalog) {
      return `### 🤖 I am GadgetAgent AI — Your Autonomous 3D Tech Advisor!\n\n` +
        `Unlike standard text chatbots, I have full **autonomous agency** to interact directly with GadgetHub on your screen:\n\n` +
        `• 🔍 **Answer Any Question:** From hardware architecture (M4, Snapdragon, Ray Tracing, OLED) to store policies, order tracking, and delivery timelines.\n` +
        `• ⚖️ **Side-by-Side Comparisons:** Tell me *"Compare iPhone and Galaxy"* and I will automatically open the comparison matrix!\n` +
        `• 🏷️ **Autonomous Coupon Negotiation:** Tell me *"Add AirPods to cart with coupon"* and I will calculate the biggest discount (VIP2026/SAVE10) and load your cart!\n` +
        `• 🎯 **Filter the Catalog:** Ask for *"Laptops under 2 lakh"* and I will adjust the live filters and scroll to the matching items.\n` +
        `• 🔄 **3D Multi-Angle Inspection:** Ask to *"Inspect Switch OLED"* and I will launch the 3D gallery to show front, back, and side profiles!\n\n` +
        `What would you like to explore or do today?`;
    }
  },

  // 24. Tech Humor
  {
    keywords: ['joke', 'funny', 'laugh'],
    match(p) {
      return p.includes('joke') || p.includes('funny') || p.includes('laugh');
    },
    title: 'Tech Humor',
    answer(p, catalog) {
      const jokes = [
        "Why do programmers prefer dark mode? **Because light attracts bugs!** 🐛",
        "There are 10 types of people in the world: **those who understand binary, and those who don't.** 😄",
        "Why was the JavaScript developer sad? **Because they didn't know how to 'null' their feelings!** 💔",
        "Why do hardware engineers hate elevators? **Because they're always worried about register overflow!** ⚡",
        "How many developers does it take to change a lightbulb? **None — that's a hardware issue!** 💡"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)] + "\n\nNeed any gadget advice or spec comparisons while we're here?";
    }
  }
];

// ======================== PRODUCT / CATALOG INTROSPECTION ========================

/**
 * Find products matching user query with fuzzy/keyword scoring
 */
function findMatchingProducts(prompt, catalog) {
  const p = normalizeText(prompt);
  const words = p.split(/\s+/).filter(w => w.length > 2);

  const scored = catalog.map(item => {
    let score = 0;
    const nameLower = item.name.toLowerCase();
    const brandLower = item.brand.toLowerCase();
    const catLower = item.category.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const specsStr = JSON.stringify(item.specs || {}).toLowerCase();

    // Direct brand/name hits
    if (p.includes(brandLower)) score += 5;
    if (p.includes(catLower)) score += 4;
    
    // Check specific gadget keywords
    const specificKeys = ['iphone', 'galaxy', 'macbook', 'sony', 'pixel', 'switch', 'rog ally', 'ipad', 'dell', 'airpods', 'logitech', 'ultra'];
    for (const key of specificKeys) {
      if (p.includes(key) && (nameLower.includes(key) || brandLower.includes(key))) {
        score += 10;
      }
    }

    // Match words
    for (const word of words) {
      if (nameLower.includes(word)) score += 3;
      if (descLower.includes(word)) score += 1;
      if (specsStr.includes(word)) score += 2;
    }

    return { product: item, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.product);
}

/**
 * Handle direct product spec questions
 */
function checkProductSpecQuery(prompt, catalog) {
  const p = normalizeText(prompt);
  const matching = findMatchingProducts(prompt, catalog);
  if (matching.length === 0) return null;

  const target = matching[0];
  const isAskingSpecs = p.includes('spec') || p.includes('feature') || p.includes('tell me about') || 
                        p.includes('price of') || p.includes('how much') || p.includes('detail') ||
                        p.includes('what is the') || p.includes('about the') || p.includes('battery of') ||
                        p.includes('camera of') || p.includes('display of') || p.includes('processor of');

  if (isAskingSpecs || (matching.length === 1 && p.length < 35)) {
    const specsObj = target.specs || {};
    const specsBullets = Object.entries(specsObj)
      .map(([k, v]) => `• **${k}:** ${v}`)
      .join('\n');

    const reply = `### 📱 ${target.name}\n\n` +
      `**Brand:** ${target.brand} | **Category:** ${target.category} | **Rating:** ⭐ ${target.avgRating || 4.8} / 5.0\n` +
      `**Official Store Price:** **${formatINR(target.price)}** (Inclusive of all taxes)\n\n` +
      `**Overview:**\n${target.description}\n\n` +
      `**Key Specifications:**\n${specsBullets || '• Top-tier hardware architecture and premium craftsmanship.'}\n\n` +
      `💡 *Would you like me to add this to your cart with coupon **VIP2026** (15% OFF) or compare it with another device?*`;

    return {
      reply,
      products: [target],
      targetProduct: target
    };
  }

  return null;
}

/**
 * Check for budget, price extremums, and category queries
 */
function checkCatalogQuery(prompt, catalog) {
  const p = normalizeText(prompt);

  // Cheapest gadget
  if (p.includes('cheapest') || p.includes('lowest price') || p.includes('most affordable')) {
    const sorted = [...catalog].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    return {
      reply: `The most affordable gadget currently on GadgetHub is the **${cheapest.name}** at just **${formatINR(cheapest.price)}**! ` +
        `It delivers outstanding performance in the **${cheapest.category}** category.\n\n` +
        `Would you like me to add it to your cart or inspect its multi-angle views?`,
      products: [cheapest]
    };
  }

  // Most expensive / ultra-flagship
  if (p.includes('most expensive') || p.includes('highest price') || p.includes('priciest') || p.includes('top flagship')) {
    const sorted = [...catalog].sort((a, b) => b.price - a.price);
    const top = sorted[0];
    return {
      reply: `The pinnacle of engineering on GadgetHub is the **${top.name}** priced at **${formatINR(top.price)}**! ` +
        `Equipped with top-tier hardware: ${top.description}`,
      products: [top]
    };
  }

  // Highest rated
  if (p.includes('highest rated') || p.includes('best rated') || p.includes('top rated') || p.includes('customer favorite')) {
    const sorted = [...catalog].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    const topRated = sorted.slice(0, 3);
    return {
      reply: `Our highest-rated customer favorites based on verified buyer reviews are:\n\n` +
        topRated.map((p, i) => `${i + 1}. **${p.name}** — ⭐ **${p.avgRating || 5.0} / 5.0** (${formatINR(p.price)})`).join('\n') +
        `\n\nAll three are currently in stock with Free 1-Day Prime Delivery!`,
      products: topRated
    };
  }

  return null;
}

// ======================== AUTONOMOUS ACTION DETERMINATION ========================

function determineActions(prompt, catalog, matchedProducts = []) {
  const p = normalizeText(prompt);
  const actions = [];

  // 1. Comparison Action
  if (p.includes('compare') || p.includes('vs') || p.includes('versus') || p.includes('difference between')) {
    let p1 = null;
    let p2 = null;

    if (p.includes('iphone') || p.includes('apple')) p1 = catalog.find(x => x.name.toLowerCase().includes('iphone'));
    if (p.includes('s24') || p.includes('samsung') || p.includes('galaxy')) p2 = catalog.find(x => x.name.toLowerCase().includes('s24'));
    if (p.includes('rog') || p.includes('ally')) {
      if (!p1) p1 = catalog.find(x => x.name.toLowerCase().includes('ally'));
      else if (!p2) p2 = catalog.find(x => x.name.toLowerCase().includes('ally'));
    }
    if (p.includes('switch') || p.includes('nintendo')) {
      if (!p1) p1 = catalog.find(x => x.name.toLowerCase().includes('switch'));
      else if (!p2) p2 = catalog.find(x => x.name.toLowerCase().includes('switch'));
    }
    if (p.includes('macbook')) {
      if (!p1) p1 = catalog.find(x => x.name.toLowerCase().includes('macbook'));
      else if (!p2) p2 = catalog.find(x => x.name.toLowerCase().includes('macbook'));
    }
    if (p.includes('sony') || p.includes('xm5')) {
      if (!p1) p1 = catalog.find(x => x.name.toLowerCase().includes('xm5'));
      else if (!p2) p2 = catalog.find(x => x.name.toLowerCase().includes('xm5'));
    }
    if (p.includes('airpods')) {
      if (!p1) p1 = catalog.find(x => x.name.toLowerCase().includes('airpods'));
      else if (!p2) p2 = catalog.find(x => x.name.toLowerCase().includes('airpods'));
    }

    if (!p1 || !p2) {
      if (matchedProducts.length >= 2) {
        p1 = p1 || matchedProducts[0];
        p2 = p2 || matchedProducts[1];
      } else {
        const smartphones = catalog.filter(x => x.category === 'Smartphones');
        p1 = p1 || smartphones[0];
        p2 = p2 || smartphones[1];
      }
    }

    if (p1 && p2 && p1._id.toString() !== p2._id.toString()) {
      actions.push({
        type: 'COMPARE_PRODUCTS',
        payload: { productIds: [p1._id, p2._id] }
      });
    }
  }

  // 2. Add to cart with coupon
  else if (p.includes('add') && (p.includes('cart') || p.includes('buy') || p.includes('coupon') || p.includes('order'))) {
    const target = matchedProducts[0] || catalog.find(x => x.name.toLowerCase().includes('airpods')) || catalog[0];
    actions.push({
      type: 'ADD_TO_CART_WITH_COUPON',
      payload: {
        product: target,
        coupon: 'VIP2026'
      }
    });
  }

  // 3. Desk Bundle
  else if (p.includes('bundle') || p.includes('setup') || p.includes('student bundle') || p.includes('work setup')) {
    const mouse = catalog.find(x => x.name.toLowerCase().includes('master 3s'));
    const laptop = catalog.find(x => x.category === 'Laptops');
    const items = [laptop, mouse].filter(Boolean);
    actions.push({
      type: 'ADD_BUNDLE_TO_CART',
      payload: {
        products: items,
        coupon: 'VIP2026'
      }
    });
  }

  // 4. Filter Catalog
  else if (p.includes('filter') || p.includes('show laptops') || p.includes('show phones') || p.includes('show audio') || p.includes('under 30000') || p.includes('under 50000') || p.includes('under 100000') || p.includes('under 2 lakh')) {
    let cat = 'All';
    if (p.includes('laptop')) cat = 'Laptops';
    else if (p.includes('phone') || p.includes('smartphone')) cat = 'Smartphones';
    else if (p.includes('audio') || p.includes('headphone') || p.includes('earbud')) cat = 'Audio';
    else if (p.includes('gaming') || p.includes('console')) cat = 'Gaming';
    else if (p.includes('wearable') || p.includes('watch')) cat = 'Wearables';

    let maxPrice = null;
    if (p.includes('30000') || p.includes('30k')) maxPrice = 30000;
    else if (p.includes('50000') || p.includes('50k')) maxPrice = 50000;
    else if (p.includes('100000') || p.includes('1 lakh') || p.includes('100k')) maxPrice = 100000;
    else if (p.includes('200000') || p.includes('2 lakh') || p.includes('200k')) maxPrice = 200000;

    actions.push({
      type: 'FILTER_CATALOG',
      payload: { category: cat, maxPrice }
    });
  }

  // 5. Open product angles / inspect
  else if (p.includes('angle') || p.includes('inspect') || p.includes('view') || p.includes('show me')) {
    if (matchedProducts.length > 0) {
      actions.push({
        type: 'OPEN_PRODUCT',
        payload: { productId: matchedProducts[0]._id, angleIndex: 1 }
      });
    }
  }

  return actions;
}

// ======================== OPTIONAL EXTERNAL LLM INTEGRATION (GEMINI) ========================

async function queryGeminiLLM(prompt, catalog, context) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const catalogSummary = catalog.map(p => 
      `- ${p.name} (${p.brand}, ${p.category}): ₹${p.price}. Specs: ${JSON.stringify(p.specs || {})}`
    ).join('\n');

    const systemPrompt = `You are GadgetAgent AI, the brilliant, knowledgeable, and autonomous technical advisor for GadgetHub (an advanced electronics e-commerce store with NoSQL database).
You can answer ANY question about technology, electronics hardware, comparisons, code, silicon, displays, or store policies.
Store inventory:
${catalogSummary}

Store details:
- Shipping: Free 1-Day Prime Delivery available; standard shipping is free. Open-box delivery with associate verification for ₹199.
- Exchange: Up to ₹30,050 off on old phones/laptops with instant price deduction.
- Coupons: VIP2026 (15% off), SAVE10 (10% off), FLAT500 (₹500 off orders > ₹2000).
- Deliveries are tracked live in the Profile Deliveries tab and sidebar.
- NoSQL Architecture: Powered by MongoDB for flexible specs and embedded reviews.

Respond thoroughly, concisely, and helpfully using markdown. Format with bolding and bullet points where helpful.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: "${prompt}"` }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return generatedText;
      }
    }
  } catch (err) {
    console.warn('Gemini API call timed out or failed, falling back to built-in knowledge brain:', err.message);
  }

  return null;
}

// ======================== MASTER AGENT ORCHESTRATOR ========================

/**
 * Process any user query through the Multi-Agent System
 */
async function processAgentQuery(prompt, catalog = [], context = {}) {
  const cleanPrompt = normalizeText(prompt);
  const thoughtProcess = [
    { step: 1, type: 'perceive', text: `Perceived user input: "${prompt}"` },
    { step: 2, type: 'analyze', text: 'Analyzing semantic intent, technical ontology, catalog entities, and UI actions...' }
  ];

  let reply = '';
  let actions = [];
  let recommendedProducts = [];

  // Step 1: Check if external LLM provides an answer
  const llmReply = await queryGeminiLLM(prompt, catalog, context);
  if (llmReply) {
    thoughtProcess.push({ step: 3, type: 'query', text: 'Queried Gemini Generative AI for real-time natural language synthesis...' });
    reply = llmReply;
    recommendedProducts = findMatchingProducts(cleanPrompt, catalog).slice(0, 3);
    actions = determineActions(cleanPrompt, catalog, recommendedProducts);
    if (actions.length > 0) {
      thoughtProcess.push({ step: 4, type: 'execute', text: `Dispatched ${actions.length} autonomous UI action(s): ${actions.map(a => a.type).join(', ')}` });
    }
    return { reply, thoughtProcess, actions, recommendedProducts };
  }

  // Step 2: Check Tech Ontology & Concept Knowledge Base
  const matchedTech = TECH_KNOWLEDGE.find(item => item.match(cleanPrompt));
  if (matchedTech) {
    thoughtProcess.push({ step: 3, type: 'synthesize', text: `Activated Tech Knowledge Domain: "${matchedTech.title}"...` });
    reply = matchedTech.answer(cleanPrompt, catalog);
    recommendedProducts = findMatchingProducts(cleanPrompt, catalog).slice(0, 3);
    actions = determineActions(cleanPrompt, catalog, recommendedProducts);
    if (actions.length > 0) {
      thoughtProcess.push({ step: 4, type: 'execute', text: `Emitted UI Action: ${actions[0].type}` });
    }
    return { reply, thoughtProcess, actions, recommendedProducts };
  }

  // Step 3: Check Direct Product Specifications
  const productSpecResult = checkProductSpecQuery(cleanPrompt, catalog);
  if (productSpecResult) {
    thoughtProcess.push({ step: 3, type: 'query', text: `Retrieved product entity: "${productSpecResult.targetProduct.name}" from MongoDB...` });
    thoughtProcess.push({ step: 4, type: 'synthesize', text: 'Compiled detailed technical specifications and hardware overview.' });
    reply = productSpecResult.reply;
    recommendedProducts = productSpecResult.products;
    actions = determineActions(cleanPrompt, catalog, recommendedProducts);
    if (actions.length > 0) {
      thoughtProcess.push({ step: 5, type: 'execute', text: `Emitted UI Action: ${actions[0].type}` });
    }
    return { reply, thoughtProcess, actions, recommendedProducts };
  }

  // Step 4: Check Catalog Extremums (Cheapest, Most Expensive, Highest Rated)
  const catalogQueryResult = checkCatalogQuery(cleanPrompt, catalog);
  if (catalogQueryResult) {
    thoughtProcess.push({ step: 3, type: 'query', text: 'Performed catalog aggregation and price/rating sorting across MongoDB collection...' });
    reply = catalogQueryResult.reply;
    recommendedProducts = catalogQueryResult.products;
    actions = determineActions(cleanPrompt, catalog, recommendedProducts);
    return { reply, thoughtProcess, actions, recommendedProducts };
  }

  // Step 5: Check Specific UI Intent Scenarios (Comparison, Bundle, Add-To-Cart, Filter)
  actions = determineActions(cleanPrompt, catalog, findMatchingProducts(cleanPrompt, catalog));
  if (actions.length > 0) {
    const act = actions[0];
    if (act.type === 'COMPARE_PRODUCTS') {
      const p1 = catalog.find(x => x._id.toString() === act.payload.productIds[0].toString());
      const p2 = catalog.find(x => x._id.toString() === act.payload.productIds[1].toString());
      thoughtProcess.push({ step: 3, type: 'query', text: `Locating devices: ${p1?.name} & ${p2?.name}...` });
      thoughtProcess.push({ step: 4, type: 'execute', text: 'Emitted UI Action: COMPARE_PRODUCTS matrix opened on screen.' });
      reply = `I have loaded **${p1?.name}** and **${p2?.name}** directly into our **Side-by-Side Comparison Matrix**! Both are top-tier flagship devices with stunning displays and benchmark-leading silicon.`;
      recommendedProducts = [p1, p2].filter(Boolean);
      return { reply, thoughtProcess, actions, recommendedProducts };
    }
    
    if (act.type === 'ADD_TO_CART_WITH_COUPON') {
      const item = act.payload.product;
      const discount = Math.round(item.price * 0.15);
      thoughtProcess.push({ step: 3, type: 'optimize', text: `Selected ${item.name} at ${formatINR(item.price)}. Applied VIP coupon VIP2026 (15% OFF)...` });
      thoughtProcess.push({ step: 4, type: 'execute', text: 'Emitted UI Action: ADD_TO_CART_WITH_COUPON.' });
      reply = `I have added **${item.name}** to your cart and autonomously applied our top coupon code **VIP2026** (15% OFF), saving you **${formatINR(discount)}**!`;
      recommendedProducts = [item];
      return { reply, thoughtProcess, actions, recommendedProducts };
    }

    if (act.type === 'ADD_BUNDLE_TO_CART') {
      const items = act.payload.products;
      const total = items.reduce((acc, x) => acc + x.price, 0);
      const savings = Math.round(total * 0.15);
      thoughtProcess.push({ step: 3, type: 'synthesize', text: `Assembled tech bundle: ${items.map(x => x.name).join(' + ')}...` });
      thoughtProcess.push({ step: 4, type: 'execute', text: 'Emitted UI Action: ADD_BUNDLE_TO_CART with VIP2026.' });
      reply = `I've assembled a productivity bundle: **${items.map(x => x.name).join('** + **')}**! Combined price is ${formatINR(total)}, and applying **VIP2026** saves you **${formatINR(savings)}**!`;
      recommendedProducts = items;
      return { reply, thoughtProcess, actions, recommendedProducts };
    }

    if (act.type === 'FILTER_CATALOG') {
      thoughtProcess.push({ step: 3, type: 'execute', text: `Emitted UI Action: FILTER_CATALOG (Category: ${act.payload.category}, MaxPrice: ${act.payload.maxPrice || 'Unlimited'}).` });
      reply = `I have filtered the store catalog to show **${act.payload.category !== 'All' ? act.payload.category : 'Top Gadgets'}**${act.payload.maxPrice ? ` under ${formatINR(act.payload.maxPrice)}` : ''}. Check out the live recommendations below!`;
      recommendedProducts = catalog.filter(x => {
        if (act.payload.category !== 'All' && x.category !== act.payload.category) return false;
        if (act.payload.maxPrice && x.price > act.payload.maxPrice) return false;
        return true;
      }).slice(0, 3);
      return { reply, thoughtProcess, actions, recommendedProducts };
    }
  }

  // Step 6: Intelligent General Query Synthesis (Any other question)
  thoughtProcess.push({ step: 3, type: 'synthesize', text: 'Synthesizing contextual response using semantic tech knowledge and catalog index...' });
  const matchedItems = findMatchingProducts(cleanPrompt, catalog);
  const topPicks = matchedItems.length > 0 ? matchedItems.slice(0, 3) : catalog.slice(0, 3);

  reply = `### 💡 GadgetHub AI Advisory\n\n` +
    `Regarding your inquiry about **"${prompt}"**:\n\n` +
    `GadgetHub features an elite collection of flagship smartphones, creator laptops, noise-canceling audio gear, and gaming consoles powered by high-efficiency silicon and brilliant OLED displays.\n\n` +
    `**How I can assist you right now:**\n` +
    `• Ask any technical question (e.g. *"What is OLED vs LCD?"*, *"How does Ray Tracing work?"*, *"Can ROG Ally play GTA V?"*)\n` +
    `• Compare devices (e.g. *"Compare iPhone 15 Pro Max and Galaxy S24 Ultra"*)\n` +
    `• Store help (e.g. *"How does device exchange work?"*, *"What coupons are available?"*, *"Track my deliveries"*)\n` +
    `• Add to cart with automated discounts (e.g. *"Add AirPods Pro with coupon"*)\n\n` +
    `Here are a few recommended gadgets that might interest you:`;

  recommendedProducts = topPicks;
  return { reply, thoughtProcess, actions, recommendedProducts };
}

module.exports = {
  processAgentQuery,
  TECH_KNOWLEDGE
};
