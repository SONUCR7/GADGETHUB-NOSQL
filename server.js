const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { processAgentQuery } = require('./agentEngine');

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
// POST /api/agent - Autonomous E-Commerce Agent capable of understanding ANY question, querying catalog, comparing specs, and emitting UI action plans
app.post('/api/agent', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Agent prompt is required' });
    }

    const allProducts = await Product.find({});
    const agentResult = await processAgentQuery(prompt, allProducts, context);

    res.json({
      success: true,
      data: agentResult
    });
  } catch (error) {
    console.error('Agent endpoint error:', error);
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
