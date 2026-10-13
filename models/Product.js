const mongoose = require('mongoose');

// Embedded NoSQL Document for Reviews
const reviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required (1-5)'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main Product Schema highlighting NoSQL document flexibility
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Accessories'],
      default: 'Smartphones'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    // Flexible Key-Value Specifications (e.g. RAM: "16GB", Battery: "5000mAh", Screen: "6.7 OLED")
    specs: {
      type: Map,
      of: String,
      default: {}
    },
    inStock: {
      type: Boolean,
      default: true
    },
    // Embedded sub-documents array in MongoDB
    reviews: [reviewSchema],
    avgRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Method to automatically update avgRating when reviews change
productSchema.methods.updateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.reviews.reduce((acc, item) => acc + item.rating, 0);
    this.avgRating = parseFloat((total / this.reviews.length).toFixed(1));
  }
};

module.exports = mongoose.model('Product', productSchema);
