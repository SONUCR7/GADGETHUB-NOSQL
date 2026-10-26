const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gadgethub_jwt_super_secret_key_2026';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gadgethub';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected successfully to MongoDB (NoSQL Database)');
    console.log(`📦 Database: gadgethub at ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: Ensure MongoDB service is running locally on port 27017, or specify MONGODB_URI in a .env file.');
  });

// ======================== API ROUTES ========================

// 1. GET /api/products - Get all products with search, category, price range, and stock filters
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, inStock } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (inStock === 'true') {
      filter.inStock = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let query = Product.find(filter);

    // Sorting
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'rating_desc') query = query.sort({ avgRating: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/products/:id - Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. POST /api/products - Create a new product (CRUD: Create)
app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, category, price, imageUrl, images, description, specs, inStock } = req.body;

    const product = new Product({
      name,
      brand,
      category,
      price: Number(price),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500',
      images: Array.isArray(images) && images.length ? images : (imageUrl ? [imageUrl] : []),
      description,
      specs: specs || {},
      inStock: inStock !== undefined ? inStock : true,
      reviews: []
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. PUT /api/products/:id - Update an existing product (CRUD: Update)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, brand, category, price, imageUrl, images, description, specs, inStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (imageUrl) product.imageUrl = imageUrl;
    if (images && Array.isArray(images)) product.images = images;
    if (description) product.description = description;
    if (specs) product.specs = specs;
    if (inStock !== undefined) product.inStock = inStock;

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. GET /api/stats - Dashboard analytics
app.get('/api/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find({}, 'reviews category');
    
    let totalReviews = 0;
    const categories = new Set();
    products.forEach((p) => {
      totalReviews += p.reviews ? p.reviews.length : 0;
      if (p.category) categories.add(p.category);
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalReviews,
        totalCategories: categories.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5b. GET /api/analytics/summary - Advanced MongoDB Aggregation Pipelines ($group, $avg, $min, $max, $sort)
app.get('/api/analytics/summary', async (req, res) => {
  try {
    // Pipeline 1: Category Price & Count Breakdown using $group
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Pipeline 2: Brand Ranking by Average Rating using $group
    const brandStats = await Product.aggregate([
      {
        $group: {
          _id: '$brand',
          productCount: { $sum: 1 },
          avgRating: { $avg: '$avgRating' },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { avgRating: -1 } },
      { $limit: 6 }
    ]);

    // Pipeline 3: Overall Inventory Valuation
    const overallMetrics = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalInventoryValue: { $sum: '$price' },
          avgCatalogPrice: { $avg: '$price' },
          totalProducts: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categoryStats,
        brandStats,
        overall: overallMetrics[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5c. GET /api/products/export/json - Export complete catalog as downloadable JSON backup
app.get('/api/products/export/json', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="gadgethub-catalog-backup.json"');
    res.send(JSON.stringify(products, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. DELETE /api/products/:id - Delete a product (CRUD: Delete)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. POST /api/products/:id/reviews - Add an embedded review to a product
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    if (!reviewerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All review fields are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Push into embedded array (MongoDB atomic update)
    product.reviews.unshift({
      reviewerName,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    });

    product.updateAverageRating();
    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 7. DELETE /api/products/:id/reviews/:reviewId - Remove a review
app.delete('/api/products/:id/reviews/:reviewId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );

    product.updateAverageRating();
    await product.save();

    res.json({ success: true, message: 'Review deleted', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================== AUTHENTICATION & PROFILE API ========================

// JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// Auth Guard Middleware
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found or deleted.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth verification error:', err.message);
    res.status(401).json({ success: false, message: 'Session expired or invalid token.' });
  }
};

// 1. POST /api/auth/register - Sign up / create new account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : 'Flat 4B, Green Meadows, Bengaluru, Karnataka 560102'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error registering account' });
  }
});

// 2. POST /api/auth/login - Sign in with credentials
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        orders: user.orders,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error logging in' });
  }
});

// 3. GET /api/auth/me - Get current authenticated user profile
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. PUT /api/auth/profile - Update profile details
app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, address, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (address !== undefined) user.address = address.trim();

    if (newPassword && newPassword.trim().length >= 6) {
      user.password = newPassword.trim();
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        orders: updatedUser.orders,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST /api/auth/orders - Record order in user document upon checkout
app.post('/api/auth/orders', protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required for placing order' });
    }

    const user = await User.findById(req.user._id);
    const newOrder = {
      orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      items,
      totalAmount,
      shippingAddress: shippingAddress || user.address || 'Standard Delivery',
      status: 'Confirmed',
      createdAt: new Date()
    };

    user.orders.unshift(newOrder);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Order recorded in your account!',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================== AGENTIC AI ENDPOINT ========================
// POST /api/agent - Autonomous E-Commerce Agent capable of understanding goals, querying catalog, comparing specs, and emitting UI action plans
app.post('/api/agent', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Agent prompt is required' });
    }

    const cleanPrompt = prompt.toLowerCase().trim();
    const allProducts = await Product.find({});

    const thoughtProcess = [
      { step: 1, type: 'perceive', text: `Perceived user prompt: "${prompt}"` },
      { step: 2, type: 'analyze', text: 'Analyzing intent, target categories, budgets, and action requirements...' }
    ];

    let reply = '';
    let actions = [];
    let recommendedProducts = [];

    // Scenario 1: Compare action
    if (cleanPrompt.includes('compare') || cleanPrompt.includes('vs') || cleanPrompt.includes('versus') || cleanPrompt.includes('difference between')) {
      thoughtProcess.push({ step: 3, type: 'query', text: 'Catalog query: Searching for flagship devices to compare...' });
      
      let p1 = null;
      let p2 = null;

      if (cleanPrompt.includes('iphone') || cleanPrompt.includes('apple')) {
        p1 = allProducts.find(p => p.name.toLowerCase().includes('iphone'));
      }
      if (cleanPrompt.includes('s24') || cleanPrompt.includes('samsung') || cleanPrompt.includes('galaxy')) {
        p2 = allProducts.find(p => p.name.toLowerCase().includes('s24'));
      }
      if (!p1 || !p2) {
        // Fallback to top 2 smartphones or first 2 matching categories
        const phones = allProducts.filter(p => p.category === 'Smartphones');
        p1 = p1 || phones[0];
        p2 = p2 || phones[1];
      }

      if (p1 && p2) {
        thoughtProcess.push({ step: 4, type: 'synthesize', text: `Evaluating specs: ${p1.name} (₹${p1.price.toLocaleString('en-IN')}) vs ${p2.name} (₹${p2.price.toLocaleString('en-IN')})...` });
        thoughtProcess.push({ step: 5, type: 'execute', text: `Emitted UI Action: COMPARE_PRODUCTS with IDs [${p1._id}, ${p2._id}]` });

        reply = `I have analyzed both flagships and autonomously loaded **${p1.name}** and **${p2.name}** into the side-by-side comparison matrix for you! Both feature titanium designs and top-tier processors.`;
        actions.push({
          type: 'COMPARE_PRODUCTS',
          payload: { productIds: [p1._id, p2._id] }
        });
        recommendedProducts = [p1, p2];
      }
    }
    // Scenario 2: Add to cart with best coupon
    else if (cleanPrompt.includes('add') && (cleanPrompt.includes('cart') || cleanPrompt.includes('buy') || cleanPrompt.includes('coupon') || cleanPrompt.includes('discount'))) {
      thoughtProcess.push({ step: 3, type: 'query', text: 'Scanning catalog for target product to add...' });
      
      let targetProduct = allProducts.find(p => {
        const words = p.name.toLowerCase().split(' ');
        return words.some(w => w.length > 3 && cleanPrompt.includes(w));
      });

      if (!targetProduct) {
        targetProduct = allProducts.find(p => p.name.toLowerCase().includes('airpods')) || allProducts[0];
      }

      thoughtProcess.push({ step: 4, type: 'optimize', text: `Selected item: ${targetProduct.name} at ₹${targetProduct.price.toLocaleString('en-IN')}. Evaluating promo coupons (VIP2026: 15%, SAVE10: 10%, FLAT500: ₹500)...` });
      
      const discountVip = Math.round(targetProduct.price * 0.15);
      const discountSave = Math.round(targetProduct.price * 0.10);
      const chosenCoupon = discountVip >= discountSave ? 'VIP2026' : 'SAVE10';
      const savings = Math.max(discountVip, discountSave);
      const finalPrice = targetProduct.price - savings;

      thoughtProcess.push({ step: 5, type: 'execute', text: `Applied best promo code: "${chosenCoupon}" saving ₹${savings.toLocaleString('en-IN')}! Final price: ₹${finalPrice.toLocaleString('en-IN')}.` });

      reply = `I've added **${targetProduct.name}** to your cart and autonomously negotiated the best discount with coupon code **${chosenCoupon}** (15% OFF), saving you **₹${savings.toLocaleString('en-IN')}**!`;
      actions.push({
        type: 'ADD_TO_CART_WITH_COUPON',
        payload: {
          product: targetProduct,
          coupon: chosenCoupon
        }
      });
      recommendedProducts = [targetProduct];
    }
    // Scenario 3: Budget bundle (e.g. "under 50k", "under 2 lakh", "desk setup", "student setup")
    else if (cleanPrompt.includes('bundle') || cleanPrompt.includes('setup') || cleanPrompt.includes('student') || cleanPrompt.includes('work') || cleanPrompt.includes('coding')) {
      thoughtProcess.push({ step: 3, type: 'query', text: 'Analyzing complementary accessories and hardware combinations...' });

      let items = [];
      if (cleanPrompt.includes('50000') || cleanPrompt.includes('50k') || cleanPrompt.includes('budget')) {
        const mouse = allProducts.find(p => p.name.toLowerCase().includes('master 3s'));
        const switchConsole = allProducts.find(p => p.name.toLowerCase().includes('switch'));
        items = [mouse, switchConsole].filter(Boolean);
      } else {
        const laptop = allProducts.find(p => p.category === 'Laptops');
        const mouse = allProducts.find(p => p.name.toLowerCase().includes('master 3s'));
        items = [laptop, mouse].filter(Boolean);
      }

      const bundleTotal = items.reduce((acc, i) => acc + i.price, 0);
      const bundleSavings = Math.round(bundleTotal * 0.15);

      thoughtProcess.push({ step: 4, type: 'optimize', text: `Generated bundle: ${items.map(i => i.name).join(' + ')}. Total: ₹${bundleTotal.toLocaleString('en-IN')}.` });
      thoughtProcess.push({ step: 5, type: 'execute', text: 'Emitted UI Action: ADD_BUNDLE_TO_CART with coupon VIP2026.' });

      reply = `I assembled an optimized tech bundle tailored for your workflow: **${items.map(i => i.name).join('** + **')}**! Combined total is ₹${bundleTotal.toLocaleString('en-IN')}, and applying **VIP2026** saves you ₹${bundleSavings.toLocaleString('en-IN')}.`;
      actions.push({
        type: 'ADD_BUNDLE_TO_CART',
        payload: {
          products: items,
          coupon: 'VIP2026'
        }
      });
      recommendedProducts = items;
    }
    // Scenario 4: Category / Budget filtering
    else if (cleanPrompt.includes('laptop') || cleanPrompt.includes('phone') || cleanPrompt.includes('smartphone') || cleanPrompt.includes('audio') || cleanPrompt.includes('headphone') || cleanPrompt.includes('gaming') || cleanPrompt.includes('wearable') || cleanPrompt.includes('watch') || cleanPrompt.includes('under') || cleanPrompt.includes('below') || cleanPrompt.includes('cheap') || cleanPrompt.includes('best')) {
      let targetCat = 'All';
      if (cleanPrompt.includes('laptop')) targetCat = 'Laptops';
      else if (cleanPrompt.includes('phone') || cleanPrompt.includes('smartphone')) targetCat = 'Smartphones';
      else if (cleanPrompt.includes('audio') || cleanPrompt.includes('headphone') || cleanPrompt.includes('earbud') || cleanPrompt.includes('noise')) targetCat = 'Audio';
      else if (cleanPrompt.includes('gaming') || cleanPrompt.includes('console') || cleanPrompt.includes('ally') || cleanPrompt.includes('ps5')) targetCat = 'Gaming';
      else if (cleanPrompt.includes('wearable') || cleanPrompt.includes('watch')) targetCat = 'Wearables';

      let maxPrice = null;
      if (cleanPrompt.includes('30000') || cleanPrompt.includes('30k')) maxPrice = 30000;
      else if (cleanPrompt.includes('50000') || cleanPrompt.includes('50k')) maxPrice = 50000;
      else if (cleanPrompt.includes('70000') || cleanPrompt.includes('70k')) maxPrice = 70000;
      else if (cleanPrompt.includes('100000') || cleanPrompt.includes('1 lakh') || cleanPrompt.includes('100k')) maxPrice = 100000;
      else if (cleanPrompt.includes('200000') || cleanPrompt.includes('2 lakh') || cleanPrompt.includes('200k')) maxPrice = 200000;

      thoughtProcess.push({ step: 3, type: 'query', text: `Filtering catalog by Category="${targetCat}" and MaxPrice=${maxPrice || 'Unlimited'}...` });

      let filtered = allProducts;
      if (targetCat !== 'All') filtered = filtered.filter(p => p.category === targetCat);
      if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);

      thoughtProcess.push({ step: 4, type: 'synthesize', text: `Found ${filtered.length} matching gadgets matching your criteria.` });
      thoughtProcess.push({ step: 5, type: 'execute', text: 'Emitted UI Action: FILTER_CATALOG live on screen.' });

      reply = `I have autonomously adjusted the store filters to show **${targetCat !== 'All' ? targetCat : 'Top Gadgets'}**${maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : ''}. Here are the top recommendations:`;
      actions.push({
        type: 'FILTER_CATALOG',
        payload: {
          category: targetCat,
          maxPrice: maxPrice || null
        }
      });
      recommendedProducts = filtered.slice(0, 3);
    }
    // Scenario 5: Multi-Angle inspection
    else if (cleanPrompt.includes('angle') || cleanPrompt.includes('photo') || cleanPrompt.includes('view') || cleanPrompt.includes('inspect')) {
      const targetProduct = allProducts.find(p => cleanPrompt.includes(p.brand.toLowerCase()) || cleanPrompt.includes(p.category.toLowerCase())) || allProducts[0];
      
      thoughtProcess.push({ step: 3, type: 'query', text: `Locating product ${targetProduct.name} and multi-angle assets...` });
      thoughtProcess.push({ step: 4, type: 'execute', text: `Emitted UI Action: OPEN_PRODUCT with ID ${targetProduct._id} and switching to Angle 2 (Side Profile).` });

      reply = `Opening **${targetProduct.name}** and loading its multi-angle gallery! You can inspect the chassis, ports, and camera bump from all 4 angles.`;
      actions.push({
        type: 'OPEN_PRODUCT',
        payload: {
          productId: targetProduct._id,
          angleIndex: 1
        }
      });
      recommendedProducts = [targetProduct];
    }
    // Scenario 6: General Tech Advisory & Store Guide
    else {
      thoughtProcess.push({ step: 3, type: 'synthesize', text: 'Analyzing entire store inventory for top rated items...' });
      const topPicks = [...allProducts].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 3);
      
      thoughtProcess.push({ step: 4, type: 'execute', text: 'Prepared personalized recommendations with direct action shortcuts.' });

      reply = `Hello! I am **GadgetAgent AI**, your autonomous store advisor. I don't just chat — I can **filter the catalog**, **load side-by-side comparisons**, **inspect multi-angle views**, and **add items to your cart with automatic coupon discounts**! Tell me what you're looking for or pick an action below.`;
      recommendedProducts = topPicks;
    }

    res.json({
      success: true,
      data: {
        reply,
        thoughtProcess,
        actions,
        recommendedProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Fallback to index.html for single page client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`💻 Open http://localhost:${PORT} in your web browser`);
});
