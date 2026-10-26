// ============================================================================
// GadgetHub E-Commerce App - Full Multilingual, Amazon UI & User Authentication
// ============================================================================

// Global Application State
let currentProducts = [];
let activeCategory = 'All';
let activeSearchQuery = '';
let activeSort = 'newest';
let activePriceRange = 'all';
let activeInStockOnly = false;
let selectedProductForDetail = null;
let currentLang = localStorage.getItem('gadgethub_lang') || 'en';

// Shopping Cart (Persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('gadgethub_cart') || '[]');

// Wishlist State (Persisted in localStorage)
let wishlist = JSON.parse(localStorage.getItem('gadgethub_wishlist') || '[]');

// Gadget Comparison State (Up to 2 gadgets)
let compareList = [];

// Promo Coupon State
let appliedCoupon = null;
const AVAILABLE_COUPONS = {
  SAVE10: { type: 'percent', value: 10, label: '10% OFF on all gadgets' },
  FLAT500: { type: 'flat', value: 500, minOrder: 2000, label: '₹500 Flat OFF (min ₹2,000)' },
  VIP2026: { type: 'percent', value: 15, label: '15% VIP Gadget Enthusiast Discount' }
};

// User Authentication State (Persisted in localStorage)
let authToken = localStorage.getItem('gadgethub_token') || null;
let currentUser = JSON.parse(localStorage.getItem('gadgethub_user') || 'null');

// ======================== MULTILINGUAL / i18n DICTIONARY ========================
const i18n = {
  en: {
    brandSubtitle: 'Premium Electronics & Smart Gadgets',
    navAnalytics: 'Analytics',
    navExport: 'Export',
    navCart: 'Cart',
    navAddGadget: 'Add Gadget',
    navAuth: 'Sign In',
    searchPlaceholder: 'Search gadgets by name, brand, or feature...',
    statTotalGadgets: 'Total Gadgets',
    statEmbeddedReviews: 'Customer Reviews',
    statCategories: 'Categories',
    catAll: 'All Gadgets',
    catSmartphones: 'Smartphones',
    catLaptops: 'Laptops',
    catAudio: 'Audio',
    catWearables: 'Wearables',
    catGaming: 'Gaming',
    catAccessories: 'Accessories',
    filterPrice: 'Price:',
    filterAllPrices: 'All Prices',
    filterUnder30k: 'Under ₹30,000',
    filter30kTo100k: '₹30,000 - ₹1,00,000',
    filterAbove100k: 'Above ₹1,00,000',
    filterInStock: 'In Stock Only',
    filterSort: 'Sort:',
    sortNewest: 'Latest Added',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRatingDesc: 'Highest Rated ⭐',
    priceLabel: 'Price',
    btnCart: 'Cart',
    btnDetails: 'View Details',
    inStockBadge: '● In Stock',
    outOfStockBadge: '○ Out of Stock',
    emptyTitle: 'No gadgets found',
    emptyDesc: 'Try adjusting your search terms or filters to find what you are looking for.',
    emptyReset: 'Reset all filters',
    storeLink: 'Visit the Official Store',
    dealTag: 'Great Indian Festival',
    mrpLabel: 'M.R.P.: ',
    inclusiveTaxes: 'Inclusive of all taxes',
    emiText: 'EMI starts at ₹1,125/month. No Cost EMI available',
    offersTitle: 'Offers',
    offerCashbackTitle: 'Cashback',
    offerCashbackDesc: 'Upto ₹959 on Pay Balance',
    offerEmiTitle: 'No Cost EMI',
    offerEmiDesc: 'Save upto ₹1,786 on cards',
    offerPartnerTitle: 'Partner Offers',
    offerPartnerDesc: 'GST invoice & save 18%',
    modalOverview: 'Product Overview',
    modalSpecs: 'Key Specifications',
    primeFreeDelivery: 'FREE 1-Day Delivery',
    withExchange: 'With Exchange',
    exchangeOff: 'Up to ₹30,050 off',
    withoutExchange: 'Without Exchange',
    freeDelivery: 'FREE delivery',
    deliveryDate: 'Thursday, 15 October',
    serviceFee: '+₹199 service fee. Delivery associate will open and verify item.',
    buyBoxInStock: '● In stock',
    buyBoxAdd: 'Add to cart',
    buyBoxBuy: 'Buy Now',
    shipsFrom: 'Ships from: Amazon',
    soldBy: 'Sold by: Clicktech Retail',
    secureTxn: 'Payment: Secure transaction',
    modalCustomerReviewsTitle: 'Customer Reviews from the Internet',
    modalCustomerReviewsSubtitle: 'Verified buyer ratings from tech forums, Amazon, and community benchmarks.',
    writeReview: 'Write a Customer Review',
    yourName: 'Your Name (or Verified Channel)',
    ratingLabel: 'Rating',
    yourFeedback: 'Your Review & Feedback',
    submitReviewBtn: 'Submit Customer Review',
    closeProductView: 'Close Product View',
    cartTitle: 'Your Shopping Cart',
    cartSubtotalLabel: 'Subtotal',
    cartDeliveryLabel: 'Standard Delivery',
    cartFreeDeliveryBadge: 'Free Delivery',
    cartTotalLabel: 'Total Amount',
    cartCheckoutText: 'Complete Simulated Checkout',
    emptyCartTitle: 'Your cart is empty',
    emptyCartSubtitle: 'Explore gadgets and click "Cart" to add items.',
    sidebarLangTitle: 'Language (भाषा / ভাষা)',
    sidebarLangSubtitle: 'Choose your preferred language:',
    sidebarCategories: 'Categories',
    sidebarWelcomeGuest: 'Welcome to GadgetHub!',
    sidebarGuestSub: 'Sign in to track orders and manage your profile.',
    sidebarSignIn: 'Sign In / Register',
    sidebarMyProfile: 'Profile',
    tabSignIn: 'Sign In',
    tabSignUp: 'Create Account',
    loginBtnText: 'Sign In to GadgetHub',
    registerBtnText: 'Create Free Account',
    toastAdded: 'Added to your cart!',
    toastRemoved: 'Item removed from cart',
    toastCheckout: 'Order Placed Successfully!',
    reviewsCount: 'reviews',
    verifiedReview: 'Verified Internet Review',
    noReviewsYet: 'No reviews yet. Be the first to share your thoughts!'
  },
  hi: {
    brandSubtitle: 'प्रीमियम इलेक्ट्रॉनिक्स और स्मार्ट गैजेट्स',
    navAnalytics: 'एनालिटिक्स',
    navExport: 'एक्सपोर्ट',
    navCart: 'कार्ट',
    navAddGadget: 'गैजेट जोड़ें',
    navAuth: 'साइन इन',
    searchPlaceholder: 'नाम, ब्रांड या विशेषता द्वारा गैजेट खोजें...',
    statTotalGadgets: 'कुल गैजेट्स',
    statEmbeddedReviews: 'ग्राहक समीक्षाएं',
    statCategories: 'श्रेणियां',
    catAll: 'सभी गैजेट्स',
    catSmartphones: 'स्मार्टफ़ोन',
    catLaptops: 'लैपटॉप',
    catAudio: 'ऑडियो',
    catWearables: 'पहनने योग्य',
    catGaming: 'गेमिंग',
    catAccessories: 'एक्सेसरीज़',
    filterPrice: 'कीमत:',
    filterAllPrices: 'सभी कीमतें',
    filterUnder30k: '₹30,000 से कम',
    filter30kTo100k: '₹30,000 - ₹1,00,000',
    filterAbove100k: '₹1,00,000 से अधिक',
    filterInStock: 'केवल स्टॉक में',
    filterSort: 'क्रमबद्ध:',
    sortNewest: 'नवीनतम पहले',
    sortPriceAsc: 'कीमत: कम से अधिक',
    sortPriceDesc: 'कीमत: अधिक से कम',
    sortRatingDesc: 'सर्वोच्च रेटेड ⭐',
    priceLabel: 'कीमत',
    btnCart: 'कार्ट',
    btnDetails: 'विवरण देखें',
    inStockBadge: '● स्टॉक में उपलब्ध',
    outOfStockBadge: '○ स्टॉक समाप्त',
    emptyTitle: 'कोई गैजेट नहीं मिला',
    emptyDesc: 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें, या एक नया गैजेट जोड़ें।',
    emptyReset: 'सभी फ़िल्टर रीसेट करें',
    storeLink: 'ऑफिशियल स्टोर पर जाएं',
    dealTag: 'ग्रेट इंडियन फेस्टिवल',
    mrpLabel: 'एम.आर.पी.: ',
    inclusiveTaxes: 'सभी कर शामिल हैं',
    emiText: 'ईएमआई ₹1,125/माह से शुरू। नो कॉस्ट ईएमआई उपलब्ध',
    offersTitle: 'ऑफ़र',
    offerCashbackTitle: 'कैशबैक',
    offerCashbackDesc: 'पे बैलेंस पर ₹959 तक',
    offerEmiTitle: 'नो कॉस्ट ईएमआई',
    offerEmiDesc: 'कार्ड पर ₹1,786 तक बचाएं',
    offerPartnerTitle: 'पार्टनर ऑफ़र',
    offerPartnerDesc: 'जीएसटी चालान पर 18% बचाएं',
    modalOverview: 'उत्पाद अवलोकन',
    modalSpecs: 'मुख्य विशेषताएं',
    primeFreeDelivery: 'मुफ़्त 1-दिवसीय डिलीवरी',
    withExchange: 'एक्सचेंज के साथ',
    exchangeOff: '₹30,050 तक की छूट',
    withoutExchange: 'बिना एक्सचेंज के',
    freeDelivery: 'मुफ़्त डिलीवरी',
    deliveryDate: 'गुरुवार, 15 अक्टूबर',
    serviceFee: '+₹199 सेवा शुल्क। डिलीवरी सहयोगी आइटम खोलकर सत्यापित करेगा।',
    buyBoxInStock: '● स्टॉक में उपलब्ध',
    buyBoxAdd: 'कार्ट में जोड़ें',
    buyBoxBuy: 'अभी खरीदें',
    shipsFrom: 'डिलीवरी: अमेज़न',
    soldBy: 'विक्रेता: क्लिकटेक रिटेल',
    secureTxn: 'भुगतान: सुरक्षित लेनदेन',
    modalCustomerReviewsTitle: 'इंटरनेट से वास्तविक ग्राहक समीक्षाएं',
    modalCustomerReviewsSubtitle: 'टेक फ़ोरम, अमेज़न और कम्युनिटी बेंचमार्क से सत्यापित खरीदार रेटिंग।',
    writeReview: 'ग्राहक समीक्षा लिखें',
    yourName: 'आपका नाम (या सत्यापित चैनल)',
    ratingLabel: 'रेटिंग',
    yourFeedback: 'आपकी समीक्षा और प्रतिक्रिया',
    submitReviewBtn: 'समीक्षा सबमिट करें',
    closeProductView: 'उत्पाद दृश्य बंद करें',
    cartTitle: 'आपकी शॉपिंग कार्ट',
    cartSubtotalLabel: 'उप-योग',
    cartDeliveryLabel: 'मानक डिलीवरी',
    cartFreeDeliveryBadge: 'मुफ़्त डिलीवरी',
    cartTotalLabel: 'कुल राशि',
    cartCheckoutText: 'सिम्युलेटेड चेकआउट पूरा करें',
    emptyCartTitle: 'आपकी कार्ट खाली है',
    emptyCartSubtitle: 'गैजेट ब्राउज़ करें और आइटम जोड़ने के लिए "कार्ट" पर क्लिक करें।',
    sidebarLangTitle: 'भाषा (Language / भाषा)',
    sidebarLangSubtitle: 'अपनी पसंदीदा भाषा चुनें:',
    sidebarCategories: 'श्रेणियां',
    sidebarWelcomeGuest: 'GadgetHub में आपका स्वागत है!',
    sidebarGuestSub: 'ऑर्डर ट्रैक करने और अपनी प्रोफ़ाइल प्रबंधित करने के लिए साइन इन करें।',
    sidebarSignIn: 'साइन इन / रजिस्टर',
    sidebarMyProfile: 'प्रोफ़ाइल',
    tabSignIn: 'साइन इन',
    tabSignUp: 'खाता बनाएं',
    loginBtnText: 'GadgetHub में साइन इन करें',
    registerBtnText: 'निःशुल्क खाता बनाएं',
    toastAdded: 'आपकी कार्ट में जोड़ा गया!',
    toastRemoved: 'कार्ट से आइटम हटाया गया',
    toastCheckout: 'ऑर्डर सफलतापूर्वक दिया गया!',
    reviewsCount: 'समीक्षाएं',
    verifiedReview: 'सत्यापित इंटरनेट समीक्षा',
    noReviewsYet: 'अभी तक कोई समीक्षा नहीं है। अपने विचार साझा करने वाले पहले व्यक्ति बनें!'
  },
  bn: {
    brandSubtitle: 'প্রিমিয়াম ইলেকট্রনিক্স ও স্মার্ট গ্যাজেট',
    navAnalytics: 'অ্যানালিটিক্স',
    navExport: 'এক্সপোর্ট',
    navCart: 'কার্ট',
    navAddGadget: 'গ্যাজেট যোগ করুন',
    navAuth: 'সাইন ইন',
    searchPlaceholder: 'নাম, ব্র্যান্ড বা বৈশিষ্ট্য দিয়ে গ্যাজেট খুঁজুন...',
    statTotalGadgets: 'মোট গ্যাজেট',
    statEmbeddedReviews: 'গ্রাহক রিভিউ',
    statCategories: 'ক্যাটাগরি',
    catAll: 'সমস্ত গ্যাজেট',
    catSmartphones: 'স্মার্টফোন',
    catLaptops: 'ল্যাপটপ',
    catAudio: 'অডিও',
    catWearables: 'ওয়্যারলেস / পরিধানযোগ্য',
    catGaming: 'গেমিং',
    catAccessories: 'অ্যাক্সেসরিজ',
    filterPrice: 'মূল্য:',
    filterAllPrices: 'সব দাম',
    filterUnder30k: '₹৩০,০০০-এর নিচে',
    filter30kTo100k: '₹৩০,০০০ - ₹১,০০,০০০',
    filterAbove100k: '₹১,০০,০০০-এর উপরে',
    filterInStock: 'শুধুমাত্র স্টকে আছে',
    filterSort: 'সাজান:',
    sortNewest: 'নতুনগুলি প্রথমে',
    sortPriceAsc: 'মূল্য: কম থেকে বেশি',
    sortPriceDesc: 'মূল্য: বেশি থেকে কম',
    sortRatingDesc: 'সর্বোচ্চ রেটিংপ্রাপ্ত ⭐',
    priceLabel: 'মূল্য',
    btnCart: 'কার্ট',
    btnDetails: 'বিবরণ দেখুন',
    inStockBadge: '● স্টকে আছে',
    outOfStockBadge: '○ স্টক শেষ',
    emptyTitle: 'কোনো গ্যাজেট পাওয়া যায়নি',
    emptyDesc: 'আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করার চেষ্টা করুন।',
    emptyReset: 'সকল ফিল্টার রিসেট করুন',
    storeLink: 'অফিসিয়াল স্টোর দেখুন',
    dealTag: 'গ্রেট ইন্ডিয়ান ফেস্টিভ্যাল',
    mrpLabel: 'এম.আর.পি.: ',
    inclusiveTaxes: 'সমস্ত কর অন্তর্ভুক্ত',
    emiText: 'ইএমআই শুরু ₹১,১২৫/মাস থেকে। নো কস্ট ইএমআই উপলব্ধ',
    offersTitle: 'অফার',
    offerCashbackTitle: 'ক্যাশব্যাক',
    offerCashbackDesc: 'পে ব্যালেন্সে ₹৯৫৯ পর্যন্ত',
    offerEmiTitle: 'নো কস্ট ইএমআই',
    offerEmiDesc: 'কার্ডে ₹১,৭৮৬ পর্যন্ত সাশ্রয়',
    offerPartnerTitle: 'পার্টনার অফার',
    offerPartnerDesc: 'জিএসটি ইনভয়েসে ১৮% সাশ্রয়',
    modalOverview: 'পণ্য পরিচিতি',
    modalSpecs: 'মূল স্পেসিফিকেশন',
    primeFreeDelivery: 'ফ্রি ১-দিনের ডেলিভারি',
    withExchange: 'এক্সচেঞ্জ সহ',
    exchangeOff: '₹৩০,০৫০ পর্যন্ত ছাড়',
    withoutExchange: 'এক্সচেঞ্জ ছাড়া',
    freeDelivery: 'ফ্রি ডেলিভারি',
    deliveryDate: 'বৃহস্পতিবার, ১৫ অক্টোবর',
    serviceFee: '+₹১৯৯ সার্ভিস ফি। ডেলিভারি সহকারী আইটেম খুলে যাচাই করবেন।',
    buyBoxInStock: '● স্টকে আছে',
    buyBoxAdd: 'কার্টে যোগ করুন',
    buyBoxBuy: 'এখনই কিনুন',
    shipsFrom: 'ডেলিভারি: অ্যামাজন',
    soldBy: 'বিক্রেতা: ক্লিকটেক রিটেল',
    secureTxn: 'পেমেন্ট: সুরক্ষিত লেনদেন',
    modalCustomerReviewsTitle: 'ইন্টারনেট থেকে প্রকৃত গ্রাহক রিভিউ',
    modalCustomerReviewsSubtitle: 'টেক ফোরাম, অ্যামাজন ও কমিউনিটি বেঞ্চমার্ক থেকে যাচাইকৃত ক্রেতা রেটিং।',
    writeReview: 'গ্রাহক রিভিউ লিখুন',
    yourName: 'আপনার নাম (বা ভেরিফায়েড চ্যানেল)',
    ratingLabel: 'রেটিং',
    yourFeedback: 'আপনার রিভিউ ও প্রতিক্রিয়া',
    submitReviewBtn: 'রিভিউ জমা দিন',
    closeProductView: 'পণ্য ভিউ বন্ধ করুন',
    cartTitle: 'আপনার শপিং কার্ট',
    cartSubtotalLabel: 'সাবটোটাল',
    cartDeliveryLabel: 'সাধারণ ডেলিভারি',
    cartFreeDeliveryBadge: 'ফ্রি ডেলিভারি',
    cartTotalLabel: 'মোট পরিমাণ',
    cartCheckoutText: 'সিমুলেটেড চেকআউট সম্পন্ন করুন',
    emptyCartTitle: 'আপনার কার্ট খালি',
    emptyCartSubtitle: 'গ্যাজেট দেখুন এবং আইটেম যোগ করতে "কার্ট" বাটনে ক্লিক করুন।',
    sidebarLangTitle: 'ভাষা (Language / भाषा)',
    sidebarLangSubtitle: 'আপনার পছন্দের ভাষা নির্বাচন করুন:',
    sidebarCategories: 'ক্যাটাগরি',
    sidebarWelcomeGuest: 'GadgetHub-এ আপনাকে স্বাগতম!',
    sidebarGuestSub: 'অর্ডার ট্র্যাক করতে এবং আপনার প্রোফাইল পরিচালনা করতে সাইন ইন করুন।',
    sidebarSignIn: 'সাইন ইন / রেজিস্টার',
    sidebarMyProfile: 'প্রোফাইল',
    tabSignIn: 'সাইন ইন',
    tabSignUp: 'অ্যাকাউন্ট তৈরি করুন',
    loginBtnText: 'GadgetHub-এ সাইন ইন করুন',
    registerBtnText: 'বিনামূল্যে অ্যাকাউন্ট তৈরি করুন',
    toastAdded: 'আপনার কার্টে যোগ করা হয়েছে!',
    toastRemoved: 'কার্ট থেকে আইটেম সরানো হয়েছে',
    toastCheckout: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!',
    reviewsCount: 'টি রিভিউ',
    verifiedReview: 'যাচাইকৃত ইন্টারনেট রিভিউ',
    noReviewsYet: 'এখনও কোনো রিভিউ নেই। প্রথম রিভিউ দিন!'
  }
};

// Helper: Translation lookup
function t(key) {
  const dict = i18n[currentLang] || i18n.en;
  return dict[key] || i18n.en[key] || key;
}

// Localized Numbers & Currency
function formatCurrency(amount) {
  const locale = currentLang === 'hi' ? 'hi-IN' : (currentLang === 'bn' ? 'bn-IN' : 'en-IN');
  return '₹' + Number(amount).toLocaleString(locale);
}

function formatNumber(num) {
  const locale = currentLang === 'hi' ? 'hi-IN' : (currentLang === 'bn' ? 'bn-IN' : 'en-IN');
  return Number(num).toLocaleString(locale);
}

// ======================== DOM ELEMENTS ========================
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const sortSelect = document.getElementById('sortSelect');
const categoryPills = document.querySelectorAll('.cat-pill');
const priceRangeSelect = document.getElementById('priceRangeSelect');
const inStockCheckbox = document.getElementById('inStockCheckbox');

// Stats Elements
const statTotalProducts = document.getElementById('statTotalProducts');
const statTotalReviews = document.getElementById('statTotalReviews');
const statTotalCategories = document.getElementById('statTotalCategories');

// Sidebar Drawer Elements
const openSidebarBtn = document.getElementById('openSidebarBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const sidebarDrawerBackdrop = document.getElementById('sidebarDrawerBackdrop');
const sidebarDrawerPanel = document.getElementById('sidebarDrawerPanel');
const navbarLangSelect = document.getElementById('navbarLangSelect');

// Detail Modal Elements
const detailModal = document.getElementById('detailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const closeDetailModalFooterBtn = document.getElementById('closeDetailModalFooterBtn');
const addReviewForm = document.getElementById('addReviewForm');

// Product Form Modal Elements
const productFormModal = document.getElementById('productFormModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeProductFormBtn = document.getElementById('closeProductFormBtn');
const cancelProductFormBtn = document.getElementById('cancelProductFormBtn');
const productForm = document.getElementById('productForm');
const productFormTitle = document.getElementById('productFormTitle');
const specsContainer = document.getElementById('specsContainer');
const addSpecRowBtn = document.getElementById('addSpecRowBtn');

// Cart Drawer Elements
const openCartBtn = document.getElementById('openCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
const cartDrawerPanel = document.getElementById('cartDrawerPanel');
const cartBadge = document.getElementById('cartBadge');
const cartDrawerCountBadge = document.getElementById('cartDrawerCountBadge');
const cartItemsList = document.getElementById('cartItemsList');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Auth & Profile Elements
const openAuthModalBtn = document.getElementById('openAuthModalBtn');
const openProfileBtn = document.getElementById('openProfileBtn');
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const closeProfileFooterBtn = document.getElementById('closeProfileFooterBtn');
const editProfileForm = document.getElementById('editProfileForm');

// ======================== INITIALIZATION ========================
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  setupStarRating();
  setLanguage(currentLang);
  await initAuth();
  checkGateRouting();
  loadProducts();
  loadStats();
  renderCart();
  updateWishlistUI();
  updateCompareDock();
});

// Setup All DOM Event Listeners
function setupEventListeners() {
  // Search handlers with debouncing
  let searchTimeout;
  const handleSearch = (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      activeSearchQuery = e.target.value.trim();
      loadProducts();
    }, 300);
  };
  if (searchInput) searchInput.addEventListener('input', handleSearch);
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => {
      if (searchInput) searchInput.value = e.target.value;
      handleSearch(e);
    });
  }

  // Category filtering
  categoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      selectCategory(pill.dataset.category);
    });
  });

  // Sorting
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      loadProducts();
    });
  }

  // Price Range Filter
  if (priceRangeSelect) {
    priceRangeSelect.addEventListener('change', (e) => {
      activePriceRange = e.target.value;
      loadProducts();
    });
  }

  // In-Stock Checkbox Filter
  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      activeInStockOnly = e.target.checked;
      loadProducts();
    });
  }

  // Sidebar Controls
  if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarDrawerBackdrop) {
    sidebarDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === sidebarDrawerBackdrop) closeSidebar();
    });
  }

  // Navbar Language Switcher
  if (navbarLangSelect) {
    navbarLangSelect.addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // Product Modals
  if (openAddModalBtn) openAddModalBtn.addEventListener('click', () => openProductForm(null));
  if (closeProductFormBtn) closeProductFormBtn.addEventListener('click', closeProductForm);
  if (cancelProductFormBtn) cancelProductFormBtn.addEventListener('click', closeProductForm);
  if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', closeDetailModal);
  if (closeDetailModalFooterBtn) closeDetailModalFooterBtn.addEventListener('click', closeDetailModal);

  // Dynamic Specs Row Builder
  if (addSpecRowBtn) addSpecRowBtn.addEventListener('click', () => addSpecRow('', ''));

  // Product & Review Form Submissions
  if (productForm) productForm.addEventListener('submit', handleProductFormSubmit);
  if (addReviewForm) addReviewForm.addEventListener('submit', handleAddReviewSubmit);

  // Cart Drawer Toggles
  if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCartDrawer(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  if (cartDrawerBackdrop) {
    cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) toggleCartDrawer(false);
    });
  }
  if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);

  // Wishlist Drawer Toggles
  const openWishlistBtn = document.getElementById('openWishlistBtn');
  if (openWishlistBtn) openWishlistBtn.addEventListener('click', openWishlistDrawer);
  const wishlistDrawerBackdrop = document.getElementById('wishlistDrawerBackdrop');
  if (wishlistDrawerBackdrop) {
    wishlistDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === wishlistDrawerBackdrop) closeWishlistDrawer();
    });
  }

  // Auth & Profile Toggles
  if (openAuthModalBtn) openAuthModalBtn.addEventListener('click', () => showGate('login', true));
  if (openProfileBtn) openProfileBtn.addEventListener('click', openProfileModal);
  if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
  if (closeProfileModalBtn) closeProfileModalBtn.addEventListener('click', closeProfileModal);
  if (closeProfileFooterBtn) closeProfileFooterBtn.addEventListener('click', closeProfileModal);

  // Gate Form Listeners (User Reference Gateway)
  const gateLoginForm = document.getElementById('gateLoginForm');
  const gateRegisterForm = document.getElementById('gateRegisterForm');
  if (gateLoginForm) gateLoginForm.addEventListener('submit', handleGateLoginSubmit);
  if (gateRegisterForm) gateRegisterForm.addEventListener('submit', handleGateRegisterSubmit);

  // Browser navigation popstate
  window.addEventListener('popstate', checkGateRouting);

  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (registerForm) registerForm.addEventListener('submit', handleRegisterSubmit);
  if (editProfileForm) editProfileForm.addEventListener('submit', handleProfileUpdate);
}

// ======================== AUTH GATEWAY (INITIAL ENTRY SCREEN) ========================
function checkGateRouting() {
  const path = window.location.pathname.toLowerCase();
  
  if (path === '/register') {
    if (authToken && currentUser) {
      hideGate();
      if (window.location.pathname !== '/') window.history.replaceState(null, '', '/');
    } else {
      showGate('register', false);
    }
  } else if (path === '/login') {
    if (authToken && currentUser) {
      hideGate();
      if (window.location.pathname !== '/') window.history.replaceState(null, '', '/');
    } else {
      showGate('login', false);
    }
  } else {
    // Root path /
    if (authToken && currentUser) {
      hideGate();
    } else if (sessionStorage.getItem('gadgethub_guest') === 'true') {
      hideGate();
    } else {
      // First-time or unauthenticated user: show login gateway
      showGate('login', false);
    }
  }
}

function showGate(tab = 'login', updateUrl = true) {
  const gate = document.getElementById('authGateScreen');
  const main = document.getElementById('mainAppScreen');
  if (gate) gate.classList.remove('hidden');
  if (main) main.classList.add('hidden');
  switchGateAuth(tab, updateUrl);
}

function hideGate() {
  const gate = document.getElementById('authGateScreen');
  const main = document.getElementById('mainAppScreen');
  if (gate) gate.classList.add('hidden');
  if (main) main.classList.remove('hidden');
}

function switchGateAuth(tab = 'login', updateUrl = true) {
  const loginSec = document.getElementById('gateLoginSection');
  const regSec = document.getElementById('gateRegisterSection');
  const tabLogin = document.getElementById('gateTabLoginBtn');
  const tabReg = document.getElementById('gateTabRegisterBtn');

  if (tab === 'register') {
    if (loginSec) loginSec.classList.add('hidden');
    if (regSec) regSec.classList.remove('hidden');
    if (tabLogin) {
      tabLogin.className = 'px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer';
    }
    if (tabReg) {
      tabReg.className = 'px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20';
    }
    if (updateUrl && window.location.pathname !== '/register') {
      window.history.pushState(null, '', '/register');
    }
  } else {
    if (loginSec) loginSec.classList.remove('hidden');
    if (regSec) regSec.classList.add('hidden');
    if (tabLogin) {
      tabLogin.className = 'px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20';
    }
    if (tabReg) {
      tabReg.className = 'px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer';
    }
    if (updateUrl && window.location.pathname !== '/login') {
      window.history.pushState(null, '', '/login');
    }
  }
}

function fillGateDemoCredentials() {
  const emailInput = document.getElementById('gateLoginEmail');
  const passInput = document.getElementById('gateLoginPassword');
  if (emailInput) emailInput.value = 'priya@gadgethub.com';
  if (passInput) passInput.value = 'password123';
  showToast('Filled demo account: priya@gadgethub.com', 'info');
}

function toggleGatePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

function continueAsGuest() {
  sessionStorage.setItem('gadgethub_guest', 'true');
  hideGate();
  if (window.location.pathname !== '/') {
    window.history.pushState(null, '', '/');
  }
  loadProducts();
  loadStats();
  showToast('Welcome to GadgetHub! Exploring catalog in guest mode.', 'info');
}

async function handleGateLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('gateLoginEmail').value.trim();
  const password = document.getElementById('gateLoginPassword').value.trim();
  const submitBtn = document.getElementById('gateLoginSubmitBtn');

  if (!email || !password) {
    showToast('Please enter both email and password', 'warning');
    return;
  }

  const origHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i><span>Signing in...</span>';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      authToken = data.token;
      currentUser = data.data;
      localStorage.setItem('gadgethub_token', authToken);
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
      sessionStorage.removeItem('gadgethub_guest');
      updateAuthUI();
      hideGate();
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      showToast(`Welcome back, ${currentUser.name}! 👋`, 'success');
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    console.error('Gate login error:', err);
    showToast('Failed to connect to authentication server', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
    }
  }
}

async function handleGateRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('gateRegisterUsername').value.trim();
  const email = document.getElementById('gateRegisterEmail').value.trim();
  const password = document.getElementById('gateRegisterPassword').value.trim();
  const submitBtn = document.getElementById('gateRegisterSubmitBtn');

  if (!name || !email || !password) {
    showToast('Please fill in username, email, and password', 'warning');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'warning');
    return;
  }

  const origHtml = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i><span>Registering...</span>';
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (data.success) {
      authToken = data.token;
      currentUser = data.data;
      localStorage.setItem('gadgethub_token', authToken);
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
      sessionStorage.removeItem('gadgethub_guest');
      updateAuthUI();
      hideGate();
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      showToast(`Account created! Welcome to GadgetHub, ${currentUser.name}! 🚀`, 'success');
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    console.error('Gate register error:', err);
    showToast('Failed to connect to authentication server', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
    }
  }
}

// ======================== AUTHENTICATION & PROFILE SYSTEM ========================

async function initAuth() {
  if (!authToken) {
    updateAuthUI();
    return;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
    } else {
      // Token expired or invalid
      authToken = null;
      currentUser = null;
      localStorage.removeItem('gadgethub_token');
      localStorage.removeItem('gadgethub_user');
    }
  } catch (err) {
    console.error('Auth verification error:', err);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const openAuthBtn = document.getElementById('openAuthModalBtn');
  const openProfBtn = document.getElementById('openProfileBtn');
  const navAvatar = document.getElementById('navUserAvatar');
  const navName = document.getElementById('navUserName');
  const sideGuest = document.getElementById('sidebarGuestBlock');
  const sideUser = document.getElementById('sidebarUserBlock');
  const sideAvatar = document.getElementById('sidebarUserAvatar');
  const sideName = document.getElementById('sidebarUserName');
  const sideEmail = document.getElementById('sidebarUserEmail');

  // Sidebar MY ORDERS & DELIVERIES elements
  const sidebarOrdersBadgeCount = document.getElementById('sidebarOrdersBadgeCount');
  const sidebarOrdersSubtext = document.getElementById('sidebarOrdersSubtext');
  const sidebarDeliveriesStatusBadge = document.getElementById('sidebarDeliveriesStatusBadge');
  const sidebarDeliveriesSubtext = document.getElementById('sidebarDeliveriesSubtext');
  const sidebarRecentDeliveryPreview = document.getElementById('sidebarRecentDeliveryPreview');
  const sidebarDeliveryOrderId = document.getElementById('sidebarDeliveryOrderId');
  const sidebarDeliveryStatus = document.getElementById('sidebarDeliveryStatus');
  const sidebarDeliveryProgressBar = document.getElementById('sidebarDeliveryProgressBar');

  const orders = (currentUser && currentUser.orders) ? currentUser.orders : [];
  const orderCount = orders.length;

  if (currentUser && authToken) {
    // User is logged in
    if (openAuthBtn) openAuthBtn.classList.add('hidden');
    if (openProfBtn) {
      openProfBtn.classList.remove('hidden');
      openProfBtn.classList.add('inline-flex');
    }
    const initial = currentUser.name.charAt(0).toUpperCase();
    const firstName = currentUser.name.split(' ')[0];

    if (navAvatar) navAvatar.textContent = initial;
    if (navName) navName.textContent = firstName;

    if (sideGuest) sideGuest.classList.add('hidden');
    if (sideUser) sideUser.classList.remove('hidden');
    if (sideAvatar) sideAvatar.textContent = initial;
    if (sideName) sideName.textContent = currentUser.name;
    if (sideEmail) sideEmail.textContent = currentUser.email;

    // MY ORDERS Section update
    if (sidebarOrdersBadgeCount) {
      sidebarOrdersBadgeCount.textContent = `${orderCount} ${orderCount === 1 ? 'Order' : 'Orders'}`;
    }
    if (sidebarOrdersSubtext) {
      sidebarOrdersSubtext.textContent = orderCount > 0 
        ? `${orderCount} past order(s) placed • Invoices ready` 
        : 'Invoices, billing & past orders';
    }

    // DELIVERIES Section update
    if (orderCount > 0) {
      const activeDelivery = orders[0];
      const isDelivered = (activeDelivery.status || '').toLowerCase() === 'delivered';
      const progressWidth = isDelivered ? '100%' : '70%';

      if (sidebarDeliveriesStatusBadge) {
        sidebarDeliveriesStatusBadge.textContent = isDelivered ? 'Delivered' : 'In Transit';
        sidebarDeliveriesStatusBadge.className = `text-[10px] font-black px-2 py-0.5 rounded-full ${
          isDelivered ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
        }`;
      }
      if (sidebarDeliveriesSubtext) {
        sidebarDeliveriesSubtext.textContent = `Shipment ${activeDelivery.orderId} • ${activeDelivery.status || 'In Transit'}`;
      }
      if (sidebarRecentDeliveryPreview) {
        sidebarRecentDeliveryPreview.classList.remove('hidden');
        if (sidebarDeliveryOrderId) sidebarDeliveryOrderId.textContent = activeDelivery.orderId;
        if (sidebarDeliveryStatus) {
          sidebarDeliveryStatus.textContent = activeDelivery.status || 'In Transit';
          sidebarDeliveryStatus.className = `px-2 py-0.5 rounded-full text-[9px] font-black ${
            isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-200/90 text-cyan-900'
          }`;
        }
        if (sidebarDeliveryProgressBar) {
          sidebarDeliveryProgressBar.style.width = progressWidth;
        }
      }
    } else {
      if (sidebarDeliveriesStatusBadge) sidebarDeliveriesStatusBadge.textContent = 'No Shipments';
      if (sidebarDeliveriesSubtext) sidebarDeliveriesSubtext.textContent = 'Real-time package transit & ETA';
      if (sidebarRecentDeliveryPreview) sidebarRecentDeliveryPreview.classList.add('hidden');
    }

    // Fill reviewer author name if currently empty
    const reviewAuthor = document.getElementById('reviewAuthor');
    if (reviewAuthor && !reviewAuthor.value) {
      reviewAuthor.value = `${currentUser.name} (Verified Buyer)`;
    }
  } else {
    // Guest state
    if (openAuthBtn) openAuthBtn.classList.remove('hidden');
    if (openProfBtn) openProfBtn.classList.add('hidden');

    if (sideGuest) sideGuest.classList.remove('hidden');
    if (sideUser) sideUser.classList.add('hidden');

    if (sidebarOrdersBadgeCount) sidebarOrdersBadgeCount.textContent = '0 Orders';
    if (sidebarOrdersSubtext) sidebarOrdersSubtext.textContent = 'Sign in to view past invoices & orders';
    if (sidebarDeliveriesStatusBadge) sidebarDeliveriesStatusBadge.textContent = 'Sign In';
    if (sidebarDeliveriesSubtext) sidebarDeliveriesSubtext.textContent = 'Sign in to track real-time shipments';
    if (sidebarRecentDeliveryPreview) sidebarRecentDeliveryPreview.classList.add('hidden');
  }
}

function handleSidebarOrdersClick() {
  closeSidebar();
  if (currentUser && authToken) {
    openProfileModal('orders');
  } else {
    showToast('Please sign in to view your orders', 'info');
    showGate('login');
  }
}

function handleSidebarDeliveriesClick() {
  closeSidebar();
  if (currentUser && authToken) {
    openProfileModal('deliveries');
  } else {
    showToast('Please sign in to track live deliveries', 'info');
    showGate('login');
  }
}

function openAuthModal(tab = 'login') {
  if (!authModal) return;
  authModal.classList.remove('hidden');
  authModal.classList.add('flex');
  switchAuthTab(tab);
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.add('hidden');
  authModal.classList.remove('flex');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLoginBtn');
  const tabRegister = document.getElementById('tabRegisterBtn');
  const formLogin = document.getElementById('loginForm');
  const formRegister = document.getElementById('registerForm');

  const activeClass = 'flex-1 py-3 text-xs font-black text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/30 transition text-center flex items-center justify-center gap-1.5';
  const inactiveClass = 'flex-1 py-3 text-xs font-semibold text-slate-400 hover:text-slate-200 transition text-center flex items-center justify-center gap-1.5';

  if (tab === 'login') {
    if (tabLogin) tabLogin.className = activeClass;
    if (tabRegister) tabRegister.className = inactiveClass;
    if (formLogin) formLogin.classList.remove('hidden');
    if (formRegister) formRegister.classList.add('hidden');
  } else {
    if (tabLogin) tabLogin.className = inactiveClass;
    if (tabRegister) tabRegister.className = activeClass;
    if (formLogin) formLogin.classList.add('hidden');
    if (formRegister) formRegister.classList.remove('hidden');
  }
}

function fillDemoCredentials() {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput) emailInput.value = 'priya@gadgethub.com';
  if (passInput) passInput.value = 'password123';
  showToast('Filled demo account: priya@gadgethub.com', 'info');
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    showToast('Please enter both email and password', 'warning');
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      authToken = data.token;
      currentUser = data.data;
      localStorage.setItem('gadgethub_token', authToken);
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
      sessionStorage.removeItem('gadgethub_guest');
      updateAuthUI();
      hideGate();
      closeAuthModal();
      showToast(`Welcome back, ${currentUser.name}! 👋`, 'success');
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (err) {
    console.error('Login error:', err);
    showToast('Failed to connect to authentication server', 'error');
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phoneInput = document.getElementById('registerPhone');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const password = document.getElementById('registerPassword').value.trim();
  const address = document.getElementById('registerAddress').value.trim();

  if (!name || !email || !password) {
    showToast('Please fill in required fields (*)', 'warning');
    return;
  }

  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'warning');
    return;
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, address })
    });
    const data = await res.json();

    if (data.success) {
      authToken = data.token;
      currentUser = data.data;
      localStorage.setItem('gadgethub_token', authToken);
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
      sessionStorage.removeItem('gadgethub_guest');
      updateAuthUI();
      hideGate();
      closeAuthModal();
      showToast(`🎉 Account created! Welcome, ${currentUser.name}!`, 'success');
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (err) {
    console.error('Registration error:', err);
    showToast('Failed to create account', 'error');
  }
}

function openProfileModal(tab = 'details') {
  if (!profileModal || !currentUser) {
    showToast('Please sign in to view your profile and deliveries', 'info');
    showGate('login');
    return;
  }

  // Populate Header
  const initial = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('profileHeaderAvatar').textContent = initial;
  document.getElementById('profileHeaderName').textContent = currentUser.name;
  document.getElementById('profileHeaderEmail').textContent = currentUser.email;
  document.getElementById('profileHeaderRole').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Verified Customer';

  const memberYear = new Date(currentUser.createdAt || Date.now()).getFullYear();
  document.getElementById('profileMemberSince').textContent = `Member since ${memberYear}`;

  // Populate Edit Fields
  document.getElementById('profileInputName').value = currentUser.name || '';
  document.getElementById('profileInputEmail').value = currentUser.email || '';
  const phoneInput = document.getElementById('profileInputPhone');
  if (phoneInput) phoneInput.value = currentUser.phone || '';
  document.getElementById('profileInputAddress').value = currentUser.address || '';
  document.getElementById('profileInputPassword').value = '';

  // Populate Orders and Deliveries
  renderProfileOrders(currentUser.orders || []);

  switchProfileTab(tab);
  profileModal.classList.remove('hidden');
  profileModal.classList.add('flex');
}

function closeProfileModal() {
  if (!profileModal) return;
  profileModal.classList.add('hidden');
  profileModal.classList.remove('flex');
}

function switchProfileTab(tab) {
  const tabDetailsBtn = document.getElementById('tabProfileDetailsBtn');
  const tabOrdersBtn = document.getElementById('tabProfileOrdersBtn');
  const tabDeliveriesBtn = document.getElementById('tabProfileDeliveriesBtn');

  const detailsPanel = document.getElementById('profileDetailsPanel');
  const ordersPanel = document.getElementById('profileOrdersPanel');
  const deliveriesPanel = document.getElementById('profileDeliveriesPanel');

  const activeClass = 'pb-2.5 border-b-2 border-emerald-400 text-white flex items-center gap-1.5 transition';
  const inactiveClass = 'pb-2.5 border-b-2 border-transparent text-slate-400 hover:text-white flex items-center gap-1.5 transition';

  if (tab === 'details') {
    if (tabDetailsBtn) tabDetailsBtn.className = activeClass;
    if (tabOrdersBtn) tabOrdersBtn.className = inactiveClass;
    if (tabDeliveriesBtn) tabDeliveriesBtn.className = inactiveClass;

    if (detailsPanel) detailsPanel.classList.remove('hidden');
    if (ordersPanel) ordersPanel.classList.add('hidden');
    if (deliveriesPanel) deliveriesPanel.classList.add('hidden');
  } else if (tab === 'orders') {
    if (tabDetailsBtn) tabDetailsBtn.className = inactiveClass;
    if (tabOrdersBtn) tabOrdersBtn.className = activeClass;
    if (tabDeliveriesBtn) tabDeliveriesBtn.className = inactiveClass;

    if (detailsPanel) detailsPanel.classList.add('hidden');
    if (ordersPanel) ordersPanel.classList.remove('hidden');
    if (deliveriesPanel) deliveriesPanel.classList.add('hidden');
  } else {
    // Deliveries tab
    if (tabDetailsBtn) tabDetailsBtn.className = inactiveClass;
    if (tabOrdersBtn) tabOrdersBtn.className = inactiveClass;
    if (tabDeliveriesBtn) tabDeliveriesBtn.className = activeClass;

    if (detailsPanel) detailsPanel.classList.add('hidden');
    if (ordersPanel) ordersPanel.classList.add('hidden');
    if (deliveriesPanel) deliveriesPanel.classList.remove('hidden');
  }
}

function renderProfileOrders(orders) {
  const ordersContainer = document.getElementById('userOrdersListContainer');
  const deliveriesContainer = document.getElementById('userDeliveriesListContainer');
  const ordersCountBadge = document.getElementById('userOrdersCount');
  const deliveriesCountBadge = document.getElementById('userDeliveriesCount');

  if (ordersCountBadge) ordersCountBadge.textContent = formatNumber(orders.length);
  if (deliveriesCountBadge) deliveriesCountBadge.textContent = formatNumber(orders.length);

  // 1. EMPTY STATE
  if (orders.length === 0) {
    const emptyHtml = `
      <div class="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-inner">
          <i class="fa-solid fa-box-open"></i>
        </div>
        <p class="font-extrabold text-slate-800 text-sm">No orders recorded yet</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Explore our 3D smart gadgets catalog and place an order to see your invoices and order receipts here.</p>
        <button onclick="closeProfileModal();" class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer">
          Browse Gadgets
        </button>
      </div>
    `;
    const emptyDeliveriesHtml = `
      <div class="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400">
        <div class="w-14 h-14 mx-auto mb-3 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl shadow-inner">
          <i class="fa-solid fa-truck-ramp-box"></i>
        </div>
        <p class="font-extrabold text-slate-800 text-sm">No active shipments in transit</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">When you purchase a gadget, real-time express tracking, courier coordinates, and delivery milestones appear here.</p>
        <button onclick="closeProfileModal();" class="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer">
          Shop Trending Gadgets
        </button>
      </div>
    `;
    if (ordersContainer) ordersContainer.innerHTML = emptyHtml;
    if (deliveriesContainer) deliveriesContainer.innerHTML = emptyDeliveriesHtml;
    return;
  }

  // 2. RENDER MY ORDERS (Focus on receipt, purchase items, tax invoice, billing)
  if (ordersContainer) {
    ordersContainer.innerHTML = orders.map((o) => {
      const formattedDate = new Date(o.createdAt || Date.now()).toLocaleDateString(
        currentLang === 'hi' ? 'hi-IN' : (currentLang === 'bn' ? 'bn-IN' : 'en-US'),
        { month: 'short', day: 'numeric', year: 'numeric' }
      );

      const itemsHtml = (o.items || []).map((it) => `
        <div class="flex items-center gap-3 py-2 border-b border-slate-100 last:border-none">
          <img src="${it.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=100'}" class="w-11 h-11 object-cover rounded-xl border border-slate-200 shadow-xs">
          <div class="flex-1 min-w-0">
            <p class="text-xs font-black text-slate-900 truncate">${escapeHtml(it.name)}</p>
            <span class="text-[11px] text-slate-500 font-semibold">Qty: ${it.quantity} • ${formatCurrency(it.price)} each</span>
          </div>
          <span class="text-xs font-extrabold text-slate-900">${formatCurrency(it.price * it.quantity)}</span>
        </div>
      `).join('');

      return `
        <div class="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3.5 shadow-xs">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-200 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-900 flex items-center gap-1.5 text-sm">
                <i class="fa-solid fa-receipt text-emerald-600"></i> ${escapeHtml(o.orderId)}
              </span>
              <span class="text-slate-400 text-[11px]">${formattedDate}</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                Total: ${formatCurrency(o.totalAmount)}
              </span>
            </div>
          </div>

          <div class="divide-y divide-slate-100 bg-white p-3 rounded-xl border border-slate-200/70">
            ${itemsHtml}
          </div>

          <div class="pt-1 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span class="text-slate-600 truncate max-w-[260px]">
              <i class="fa-solid fa-location-dot text-emerald-600 mr-1"></i>${escapeHtml(o.shippingAddress || 'Home Address')}
            </span>
            <div class="flex items-center gap-2">
              <button type="button" onclick="viewOrderInvoice('${escapeHtml(o.orderId)}')" class="px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer">
                <i class="fa-solid fa-file-invoice text-emerald-600"></i> Download Tax Invoice
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 3. RENDER DELIVERIES (Focus on live shipment, courier tracking stepper, ETA)
  if (deliveriesContainer) {
    deliveriesContainer.innerHTML = orders.map((o) => {
      const formattedDate = new Date(o.createdAt || Date.now()).toLocaleDateString(
        currentLang === 'hi' ? 'hi-IN' : (currentLang === 'bn' ? 'bn-IN' : 'en-US'),
        { month: 'short', day: 'numeric', year: 'numeric' }
      );

      const isDelivered = (o.status || '').toLowerCase() === 'delivered';
      const isInTransit = (o.status || '').toLowerCase() === 'in transit' || (!isDelivered && (o.status || '').toLowerCase() !== 'cancelled');
      const progressWidth = isDelivered ? '100%' : (isInTransit ? '70%' : '35%');

      return `
        <div class="p-4.5 bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-2xl border border-cyan-200/80 space-y-4 shadow-xs">
          <div class="flex items-center justify-between pb-2.5 border-b border-cyan-100 text-xs">
            <div class="flex items-center gap-2">
              <span class="font-black text-slate-900 flex items-center gap-1.5 text-sm">
                <i class="fa-solid fa-truck-fast text-cyan-600"></i> ${escapeHtml(o.orderId)}
              </span>
              <span class="text-slate-400 text-[11px]">${formattedDate}</span>
            </div>
            <span class="px-3 py-1 rounded-full text-[11px] font-black ${isDelivered ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'}">
              <span class="inline-block w-2 h-2 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'} mr-1.5"></span>
              ${o.status || 'In Transit'}
            </span>
          </div>

          <!-- Live 4-Step Delivery Progress Stepper -->
          <div class="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
            <div class="flex items-center justify-between text-[11px] font-bold mb-2 px-1">
              <span class="text-emerald-700 flex items-center gap-1"><i class="fa-solid fa-circle-check text-emerald-600"></i> Confirmed</span>
              <span class="text-emerald-700 flex items-center gap-1"><i class="fa-solid fa-box-archive text-emerald-600"></i> Packed</span>
              <span class="${isDelivered ? 'text-emerald-700' : 'text-cyan-700 font-extrabold'} flex items-center gap-1">
                <i class="fa-solid fa-truck-fast ${isDelivered ? '' : 'text-cyan-600 animate-bounce'}"></i> Out for Delivery
              </span>
              <span class="${isDelivered ? 'text-emerald-700 font-extrabold' : 'text-slate-400'} flex items-center gap-1">
                <i class="fa-solid fa-house-chimney"></i> Delivered
              </span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-700" style="width: ${progressWidth}"></div>
            </div>
          </div>

          <div class="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Courier Carrier</div>
              <div class="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <i class="fa-solid fa-bolt text-amber-500"></i> GadgetHub Priority Express
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Arrival</div>
              <div class="font-black ${isDelivered ? 'text-emerald-700' : 'text-cyan-700'} mt-0.5">
                ${isDelivered ? 'Package Delivered' : 'Today by 8:00 PM'}
              </div>
            </div>
          </div>

          <div class="pt-0.5 text-[11px] text-slate-600 flex items-center justify-between">
            <span class="truncate max-w-[280px]">
              <i class="fa-solid fa-location-dot text-emerald-600 mr-1.5"></i>${escapeHtml(o.shippingAddress || 'Home Address')}
            </span>
            <span class="text-emerald-700 font-extrabold text-[10px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <i class="fa-solid fa-shield-halved mr-1"></i>Verified Handover
            </span>
          </div>
        </div>
      `;
    }).join('');
  }
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  if (!authToken) return;

  const name = document.getElementById('profileInputName').value.trim();
  const phoneInput = document.getElementById('profileInputPhone');
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const address = document.getElementById('profileInputAddress').value.trim();
  const newPassword = document.getElementById('profileInputPassword').value.trim();

  if (!name) {
    showToast('Name is required', 'warning');
    return;
  }

  const payload = { name, address };
  if (phone) payload.phone = phone;
  if (newPassword) payload.newPassword = newPassword;

  try {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
      updateAuthUI();
      openProfileModal(); // Refresh modal
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(data.message || 'Error updating profile', 'error');
    }
  } catch (err) {
    console.error('Profile update error:', err);
    showToast('Failed to update profile', 'error');
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('gadgethub_token');
  localStorage.removeItem('gadgethub_user');
  sessionStorage.removeItem('gadgethub_guest');
  updateAuthUI();
  closeProfileModal();
  closeAuthModal();
  closeSidebar();
  showGate('login', true);
  showToast('You have been logged out safely.', 'info');
}

// ======================== SIDEBAR CONTROLS ========================
function openSidebar() {
  if (!sidebarDrawerBackdrop || !sidebarDrawerPanel) return;
  sidebarDrawerBackdrop.classList.remove('hidden');
  setTimeout(() => {
    sidebarDrawerPanel.classList.remove('-translate-x-full');
  }, 10);
}

function closeSidebar() {
  if (!sidebarDrawerBackdrop || !sidebarDrawerPanel) return;
  sidebarDrawerPanel.classList.add('-translate-x-full');
  setTimeout(() => {
    sidebarDrawerBackdrop.classList.add('hidden');
  }, 300);
}

function selectCategory(cat) {
  activeCategory = cat;
  categoryPills.forEach((p) => {
    if (p.dataset.category === cat) {
      p.className = 'cat-pill px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white whitespace-nowrap shadow-sm';
    } else {
      p.className = 'cat-pill px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 whitespace-nowrap transition';
    }
  });
  loadProducts();
}

// ======================== MULTILINGUAL SWITCHER ========================
function setLanguage(lang) {
  if (!i18n[lang]) lang = 'en';
  currentLang = lang;
  localStorage.setItem('gadgethub_lang', lang);
  document.documentElement.lang = lang;

  // Update navbar selector
  if (navbarLangSelect) navbarLangSelect.value = lang;

  // Update sidebar option button active states & checkmarks
  document.querySelectorAll('.lang-option-btn').forEach((btn) => {
    const isSelected = btn.dataset.lang === lang;
    const checkEl = btn.querySelector('.lang-check');
    if (isSelected) {
      btn.classList.add('border-emerald-500', 'bg-emerald-50/50');
      btn.classList.remove('border-slate-200');
      if (checkEl) checkEl.classList.remove('hidden');
    } else {
      btn.classList.remove('border-emerald-500', 'bg-emerald-50/50');
      btn.classList.add('border-slate-200');
      if (checkEl) checkEl.classList.add('hidden');
    }
  });

  // Apply translations to all registered UI elements
  const updateText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  updateText('i18n-brandSubtitle', t('brandSubtitle'));
  updateText('i18n-navCart', t('navCart'));
  updateText('i18n-navAddGadget', t('navAddGadget'));
  updateText('i18n-navAuth', t('navAuth'));

  // Search input placeholders
  if (searchInput) searchInput.placeholder = t('searchPlaceholder');
  if (mobileSearchInput) mobileSearchInput.placeholder = t('searchPlaceholder');

  // Stat card labels
  updateText('i18n-statTotalGadgets', t('statTotalGadgets'));
  updateText('i18n-statEmbeddedReviews', t('statEmbeddedReviews'));
  updateText('i18n-statCategories', t('statCategories'));

  // Category filter pills
  document.querySelectorAll('.cat-text').forEach((span) => {
    const catKey = span.dataset.cat;
    if (catKey === 'All') span.textContent = t('catAll');
    else if (catKey === 'Smartphones') span.textContent = t('catSmartphones');
    else if (catKey === 'Laptops') span.textContent = t('catLaptops');
    else if (catKey === 'Audio') span.textContent = t('catAudio');
    else if (catKey === 'Wearables') span.textContent = t('catWearables');
    else if (catKey === 'Gaming') span.textContent = t('catGaming');
    else if (catKey === 'Accessories') span.textContent = t('catAccessories');
  });

  // Filter Bar
  updateText('i18n-filterPriceLabel', t('filterPrice'));
  if (priceRangeSelect) {
    priceRangeSelect.options[0].text = t('filterAllPrices');
    priceRangeSelect.options[1].text = t('filterUnder30k');
    priceRangeSelect.options[2].text = t('filter30kTo100k');
    priceRangeSelect.options[3].text = t('filterAbove100k');
  }

  updateText('i18n-filterInStockLabel', t('filterInStock'));
  updateText('i18n-filterSortLabel', t('filterSort'));
  if (sortSelect) {
    sortSelect.options[0].text = t('sortNewest');
    sortSelect.options[1].text = t('sortPriceAsc');
    sortSelect.options[2].text = t('sortPriceDesc');
    sortSelect.options[3].text = t('sortRatingDesc');
  }

  // Empty State
  updateText('i18n-emptyTitle', t('emptyTitle'));
  updateText('i18n-emptyDesc', t('emptyDesc'));
  updateText('i18n-emptyReset', t('emptyReset'));

  // Product Modal Elements
  updateText('i18n-modalMrpLabel', t('mrpLabel'));
  updateText('i18n-inclusiveTaxes', t('inclusiveTaxes'));
  updateText('i18n-modalEmiText', t('emiText'));
  updateText('i18n-offersTitle', t('offersTitle'));
  updateText('i18n-offerCashbackTitle', t('offerCashbackTitle'));
  updateText('i18n-offerCashbackDesc', t('offerCashbackDesc'));
  updateText('i18n-offerEmiTitle', t('offerEmiTitle'));
  updateText('i18n-offerEmiDesc', t('offerEmiDesc'));
  updateText('i18n-offerPartnerTitle', t('offerPartnerTitle'));
  updateText('i18n-offerPartnerDesc', t('offerPartnerDesc'));
  updateText('i18n-modalOverview', t('modalOverview'));
  updateText('i18n-modalSpecs', t('modalSpecs'));
  updateText('i18n-primeFreeDelivery', t('primeFreeDelivery'));
  updateText('i18n-withExchange', t('withExchange'));
  updateText('i18n-exchangeOff', t('exchangeOff'));
  updateText('i18n-withoutExchange', t('withoutExchange'));
  updateText('i18n-freeDelivery', t('freeDelivery'));
  updateText('i18n-deliveryDate', t('deliveryDate'));
  updateText('i18n-serviceFee', t('serviceFee'));
  updateText('i18n-buyBoxInStock', t('buyBoxInStock'));
  updateText('i18n-buyBoxAdd', t('buyBoxAdd'));
  updateText('i18n-buyBoxBuy', t('buyBoxBuy'));
  updateText('i18n-shipsFrom', t('shipsFrom'));
  updateText('i18n-soldBy', t('soldBy'));
  updateText('i18n-secureTxn', t('secureTxn'));
  updateText('i18n-modalCustomerReviewsTitle', t('modalCustomerReviewsTitle'));
  updateText('i18n-modalCustomerReviewsSubtitle', t('modalCustomerReviewsSubtitle'));
  updateText('i18n-writeReview', t('writeReview'));
  updateText('i18n-yourName', t('yourName'));
  updateText('i18n-ratingLabel', t('ratingLabel'));
  updateText('i18n-yourFeedback', t('yourFeedback'));
  updateText('i18n-submitReviewBtn', t('submitReviewBtn'));
  if (closeDetailModalFooterBtn) closeDetailModalFooterBtn.textContent = t('closeProductView');

  // Shopping Cart Drawer
  updateText('i18n-cartTitle', t('cartTitle'));
  updateText('i18n-cartSubtotalLabel', t('cartSubtotalLabel'));
  updateText('i18n-cartDeliveryLabel', t('cartDeliveryLabel'));
  updateText('i18n-cartFreeDeliveryBadge', t('cartFreeDeliveryBadge'));
  updateText('i18n-cartTotalLabel', t('cartTotalLabel'));
  updateText('i18n-cartCheckoutText', t('cartCheckoutText'));

  // Sidebar Headers & Auth
  updateText('i18n-sidebarLangTitle', t('sidebarLangTitle'));
  updateText('i18n-sidebarLangSubtitle', t('sidebarLangSubtitle'));
  updateText('i18n-sidebarCategories', t('sidebarCategories'));
  updateText('i18n-sidebarWelcomeGuest', t('sidebarWelcomeGuest'));
  updateText('i18n-sidebarGuestSub', t('sidebarGuestSub'));
  updateText('i18n-sidebarSignIn', t('sidebarSignIn'));
  updateText('i18n-sidebarMyProfile', t('sidebarMyProfile'));

  // Auth Modal
  updateText('i18n-tabSignIn', t('tabSignIn'));
  updateText('i18n-tabSignUp', t('tabSignUp'));
  updateText('i18n-loginBtnText', t('loginBtnText'));
  updateText('i18n-registerBtnText', t('registerBtnText'));

  // Re-render products grid and cart to apply language to dynamically rendered strings
  renderProducts(currentProducts);
  renderCart();

  // If detail modal is open, re-render its dynamic details
  if (selectedProductForDetail) {
    populateDetailModal(selectedProductForDetail);
  }
}

// ======================== DATA FETCHING ========================
async function loadProducts() {
  renderLoadingState();
  try {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'All') params.append('category', activeCategory);
    if (activeSearchQuery) params.append('search', activeSearchQuery);
    if (activeSort) params.append('sort', activeSort);
    if (activeInStockOnly) params.append('inStock', 'true');

    if (activePriceRange === 'under30k') {
      params.append('maxPrice', '30000');
    } else if (activePriceRange === '30k-100k') {
      params.append('minPrice', '30000');
      params.append('maxPrice', '100000');
    } else if (activePriceRange === 'above100k') {
      params.append('minPrice', '100000');
    }

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      currentProducts = data.data;
      renderProducts(currentProducts);
    } else {
      showToast(data.message || 'Error fetching products', 'error');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    productsGrid.innerHTML = `
      <div class="col-span-full p-8 text-center bg-red-50 text-red-700 rounded-2xl border border-red-200">
        <i class="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
        <p class="font-bold">Unable to connect to the backend server</p>
        <p class="text-xs mt-1">Make sure the backend server is running at <code>http://localhost:5000</code>.</p>
      </div>
    `;
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (data.success) {
      statTotalProducts.textContent = formatNumber(data.data.totalProducts);
      statTotalReviews.textContent = formatNumber(data.data.totalReviews);
      statTotalCategories.textContent = formatNumber(data.data.totalCategories);
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// ======================== RENDERING ========================
function renderLoadingState() {
  productsGrid.innerHTML = Array(6).fill(0).map(() => `
    <div class="glass-card rounded-3xl overflow-hidden shadow-sm animate-pulse">
      <div class="h-52 bg-slate-200/60"></div>
      <div class="p-5 space-y-3">
        <div class="h-4 bg-slate-200/60 rounded w-1/4"></div>
        <div class="h-6 bg-slate-200/60 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200/60 rounded w-full"></div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-6 bg-slate-200/60 rounded w-1/3"></div>
          <div class="h-8 bg-slate-200/60 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderProducts(products) {
  if (!productsGrid) return;
  if (!products || products.length === 0) {
    productsGrid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }
  if (emptyState) emptyState.classList.add('hidden');

  productsGrid.innerHTML = products.map((product) => {
    const specsMap = product.specs || {};
    const specEntries = Object.entries(specsMap).slice(0, 3);
    const specsBadges = specEntries.map(([key, val]) => `
      <span class="inline-flex items-center text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/60">
        <strong>${escapeHtml(key)}:</strong>&nbsp;${escapeHtml(val)}
      </span>
    `).join('');

    const reviewCount = product.reviews ? product.reviews.length : 0;
    const ratingStars = getStarHtml(product.avgRating || 0);
    const isWishlisted = wishlist.includes(product._id);
    const isCompared = compareList.includes(product._id);

    return `
      <div class="glass-card rounded-3xl overflow-hidden flex flex-col group relative">
        
        <!-- Product Image Banner with 3D Depth -->
        <div class="relative h-52 bg-slate-900/5 overflow-hidden cursor-pointer" onclick="viewProductDetails('${product._id}')">
          <img 
            src="${product.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500'}" 
            alt="${escapeHtml(product.name)}" 
            class="w-full h-full object-cover group-hover:scale-108 transition duration-500 ease-out"
            onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500'"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <span class="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-md">
            ${escapeHtml(product.category)}
          </span>
          <div class="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
            <button 
              type="button" 
              onclick="event.stopPropagation(); toggleWishlist('${product._id}')" 
              class="w-7 h-7 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-xs shadow-md transition active:scale-90 ${isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'} cursor-pointer"
              title="Save to Wishlist"
            >
              <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            </button>
            <span class="px-2.5 py-1 rounded-xl text-[11px] font-bold ${product.inStock ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'} shadow-md">
              ${product.inStock ? t('inStockBadge') : t('outOfStockBadge')}
            </span>
          </div>
        </div>

        <!-- Product Content -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] uppercase font-black text-slate-400 tracking-wider">${escapeHtml(product.brand)}</span>
              <div class="flex items-center gap-1 text-xs font-bold text-amber-500">
                ${ratingStars}
                <span class="text-slate-400 ml-1 font-semibold">(${formatNumber(reviewCount)})</span>
              </div>
            </div>

            <h3 class="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2 cursor-pointer" onclick="viewProductDetails('${product._id}')">
              ${escapeHtml(product.name)}
            </h3>

            <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              ${escapeHtml(product.description)}
            </p>

            <!-- Dynamic Specs Pills -->
            ${specsBadges ? `<div class="flex flex-wrap gap-1.5 mt-3.5">${specsBadges}</div>` : ''}
          </div>

          <!-- Bottom Footer with 3D Actions & Shopping Cart -->
          <div class="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-2">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block leading-tight">${t('priceLabel')}</span>
              <span class="text-xl font-black text-slate-900 tracking-tight">${formatCurrency(product.price)}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <!-- Add to Cart Button -->
              <button 
                onclick="addToCart('${product._id}')" 
                class="btn-3d px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center gap-1.5"
                title="Add to Shopping Cart"
              >
                <i class="fa-solid fa-cart-plus text-[11px]"></i>
                <span>${t('btnCart')}</span>
              </button>

              <!-- View Details & Reviews -->
              <button 
                onclick="viewProductDetails('${product._id}')" 
                class="px-2.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition"
                title="${t('btnDetails')}"
              >
                <i class="fa-solid fa-eye text-[11px]"></i>
              </button>
              
              <!-- Edit Product -->
              <button 
                onclick="openProductForm('${product._id}')" 
                class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition shadow-sm"
                title="Edit Product"
              >
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
              
              <!-- Delete Product -->
              <button 
                onclick="deleteProduct('${product._id}', '${escapeHtml(product.name)}')" 
                class="w-8 h-8 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 transition shadow-sm"
                title="Delete Product"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }).join('');
}

// ======================== SHOPPING CART ENGINE ========================
function addToCart(productId, customPrice = null, customNote = null) {
  const product = currentProducts.find((p) => p._id === productId);
  if (!product) return;

  const itemKey = customNote ? `${productId}-exchange` : productId;
  const existingIndex = cart.findIndex((item) => item.productId === itemKey);
  const finalPrice = (customPrice !== null && !isNaN(customPrice)) ? customPrice : product.price;
  const displayName = customNote ? `${product.name} (${customNote})` : product.name;

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      productId: itemKey,
      name: displayName,
      price: finalPrice,
      imageUrl: product.imageUrl,
      category: product.category,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`"${displayName}" ${t('toastAdded')}`, 'success');
}

function updateCartQuantity(productId, delta) {
  const itemIndex = cart.findIndex((item) => item.productId === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  renderCart();
  showToast(t('toastRemoved'), 'info');
}

function saveCart() {
  localStorage.setItem('gadgethub_cart', JSON.stringify(cart));
}

function renderCart() {
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cartBadge) cartBadge.textContent = formatNumber(totalItemCount);
  if (cartDrawerCountBadge) cartDrawerCountBadge.textContent = `${formatNumber(totalItemCount)} items`;
  if (cartSubtotal) cartSubtotal.textContent = formatCurrency(totalAmount);
  if (cartTotal) cartTotal.textContent = formatCurrency(totalAmount);

  if (!cartItemsList) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="text-center py-16 text-slate-400">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl text-slate-300">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <p class="font-bold text-slate-700">${t('emptyCartTitle')}</p>
        <p class="text-xs text-slate-400 mt-1">${t('emptyCartSubtitle')}</p>
      </div>
    `;
    return;
  }

  cartItemsList.innerHTML = cart.map((item) => `
    <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
      <img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" class="w-14 h-14 object-cover rounded-xl border border-slate-200">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-slate-900 truncate">${escapeHtml(item.name)}</h4>
        <p class="text-xs font-black text-emerald-600 mt-0.5">${formatCurrency(item.price * item.quantity)}</p>
        <div class="flex items-center gap-2 mt-2">
          <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
            <button onclick="updateCartQuantity('${item.productId}', -1)" class="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100">-</button>
            <span class="px-2 text-xs font-bold text-slate-800">${formatNumber(item.quantity)}</span>
            <button onclick="updateCartQuantity('${item.productId}', 1)" class="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100">+</button>
          </div>
          <button onclick="removeFromCart('${item.productId}')" class="text-rose-500 hover:text-rose-700 text-xs">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function toggleCartDrawer(open) {
  if (!cartDrawerBackdrop || !cartDrawerPanel) return;

  if (open) {
    cartDrawerBackdrop.classList.remove('hidden');
    setTimeout(() => {
      cartDrawerPanel.classList.remove('translate-x-full');
    }, 10);
  } else {
    cartDrawerPanel.classList.add('translate-x-full');
    setTimeout(() => {
      cartDrawerBackdrop.classList.add('hidden');
    }, 300);
  }
}

async function handleCheckout() {
  if (cart.length === 0) {
    showToast(t('emptyCartTitle'), 'warning');
    return;
  }

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // If user is logged in, persist the order to their MongoDB account
  if (currentUser && authToken) {
    try {
      const res = await fetch('/api/auth/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          items: cart,
          totalAmount: total,
          shippingAddress: currentUser.address
        })
      });
      const data = await res.json();
      if (data.success) {
        if (!currentUser.orders) currentUser.orders = [];
        currentUser.orders.unshift(data.data);
        localStorage.setItem('gadgethub_user', JSON.stringify(currentUser));
        updateAuthUI();
        showToast(`🎉 Order ${data.data.orderId} Placed Successfully! (${formatCurrency(total)})`, 'success');
      }
    } catch (err) {
      console.error('Order save error:', err);
    }
  } else {
    showToast(`🎉 ${t('toastCheckout')} (${formatCurrency(total)})! (Tip: Sign In to track order history)`, 'success');
  }

  cart = [];
  saveCart();
  renderCart();
  setTimeout(() => toggleCartDrawer(false), 1200);
}

// ======================== MODAL: AMAZON DETAILS & REAL REVIEWS ========================
let currentModalGallery = [];
let currentModalImageIndex = 0;

function switchModalProductImage(indexOrUrl, clickedBtn) {
  let targetIndex = 0;
  if (typeof indexOrUrl === 'number') {
    targetIndex = indexOrUrl;
  } else if (typeof indexOrUrl === 'string') {
    const foundIdx = currentModalGallery.indexOf(indexOrUrl);
    targetIndex = foundIdx !== -1 ? foundIdx : 0;
  }
  
  if (!currentModalGallery || currentModalGallery.length === 0) return;
  if (targetIndex < 0) targetIndex = 0;
  if (targetIndex >= currentModalGallery.length) targetIndex = currentModalGallery.length - 1;
  currentModalImageIndex = targetIndex;

  const targetUrl = currentModalGallery[targetIndex] || '';
  const mainImg = document.getElementById('modalProductImage');
  if (mainImg && targetUrl) {
    mainImg.style.opacity = '0.4';
    mainImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      mainImg.src = targetUrl;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 120);
  }

  // Update angle pill
  const angleText = document.getElementById('modalAngleText');
  if (angleText) {
    const angleLabels = ['Front View', 'Side Profile', 'Back / Camera View', 'Detail / In-Use View'];
    const label = angleLabels[targetIndex] || `Angle ${targetIndex + 1}`;
    angleText.textContent = `Angle ${targetIndex + 1} of ${currentModalGallery.length} • ${label}`;
  }

  // Update thumbnail buttons styling
  const rail = document.getElementById('modalThumbnailsRail');
  if (rail) {
    const buttons = rail.querySelectorAll('.modal-thumb-btn');
    buttons.forEach((btn, idx) => {
      if (idx === targetIndex) {
        btn.classList.add('border-emerald-600', 'ring-2', 'ring-emerald-500/30', 'scale-105');
        btn.classList.remove('border-slate-200', 'opacity-70');
      } else {
        btn.classList.remove('border-emerald-600', 'ring-2', 'ring-emerald-500/30', 'scale-105');
        btn.classList.add('border-slate-200', 'opacity-70');
      }
    });
  }
}

function cycleModalImage(direction) {
  if (!currentModalGallery || currentModalGallery.length <= 1) return;
  let nextIdx = (currentModalImageIndex + direction + currentModalGallery.length) % currentModalGallery.length;
  switchModalProductImage(nextIdx);
}

window.switchModalProductImage = switchModalProductImage;
window.cycleModalImage = cycleModalImage;

async function viewProductDetails(productId) {
  try {
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    if (!data.success) {
      showToast(data.message || 'Product not found', 'error');
      return;
    }

    selectedProductForDetail = data.data;
    populateDetailModal(selectedProductForDetail);

    detailModal.classList.remove('hidden');
    detailModal.classList.add('flex');
  } catch (err) {
    console.error('Error fetching detail:', err);
    showToast('Failed to open gadget details', 'error');
  }
}

let currentExchangeSelected = 'without';

function selectExchangeOption(type) {
  if (!selectedProductForDetail) return;
  currentExchangeSelected = type;

  const labelWith = document.getElementById('labelWithExchange');
  const labelWithout = document.getElementById('labelWithoutExchange');
  const radioWith = document.getElementById('radioWithExchange');
  const radioWithout = document.getElementById('radioWithoutExchange');
  const priceEl = document.getElementById('modalProductPrice');
  const exchangeBadge = document.getElementById('modalExchangeBadge');
  const discountBadge = document.getElementById('modalDiscountBadge');

  const basePrice = selectedProductForDetail.price;
  const maxExchangeOff = Math.min(Math.round(basePrice * 0.231), 30050);
  const exchangePrice = Math.max(basePrice - maxExchangeOff, 1000);

  const activeClass = 'flex items-start gap-2.5 p-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 cursor-pointer shadow-xs transition';
  const inactiveClass = 'flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition';

  if (type === 'with') {
    if (radioWith) radioWith.checked = true;
    if (radioWithout) radioWithout.checked = false;
    if (labelWith) labelWith.className = activeClass;
    if (labelWithout) labelWithout.className = inactiveClass;

    // Update main display price to exchange price
    if (priceEl) priceEl.textContent = formatCurrency(exchangePrice);
    if (exchangeBadge) {
      exchangeBadge.innerHTML = `<i class="fa-solid fa-recycle mr-1"></i>Exchange Applied: -${formatCurrency(maxExchangeOff)}`;
      exchangeBadge.classList.remove('hidden');
    }
    if (discountBadge) {
      const mrp = Math.round(basePrice * 1.56);
      const totalDiscountPercent = Math.round(((mrp - exchangePrice) / mrp) * 100);
      discountBadge.textContent = `-${totalDiscountPercent}%`;
    }
    showToast(`Exchange option active! Saved ${formatCurrency(maxExchangeOff)} on ${selectedProductForDetail.name}`, 'info');
  } else {
    if (radioWith) radioWith.checked = false;
    if (radioWithout) radioWithout.checked = true;
    if (labelWith) labelWith.className = inactiveClass;
    if (labelWithout) labelWithout.className = activeClass;

    // Reset to base price
    if (priceEl) priceEl.textContent = formatCurrency(basePrice);
    if (exchangeBadge) exchangeBadge.classList.add('hidden');
    if (discountBadge) discountBadge.textContent = '-36%';
  }
}

function populateDetailModal(p) {
  const mrp = Math.round(p.price * 1.56);

  // Breadcrumbs
  const breadcrumb = document.getElementById('modalBreadcrumbCat');
  if (breadcrumb) breadcrumb.textContent = p.category;

  const breadcrumbBrand = document.getElementById('modalBreadcrumbBrand');
  if (breadcrumbBrand) breadcrumbBrand.textContent = p.brand || 'GadgetHub';

  // Dynamic Multi-Angle Image Gallery Setup
  currentModalGallery = (Array.isArray(p.images) && p.images.length > 0) 
    ? p.images 
    : [p.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500'];
  currentModalImageIndex = 0;

  const mainImg = document.getElementById('modalProductImage');
  if (mainImg) {
    mainImg.src = currentModalGallery[0];
    mainImg.alt = p.name || 'Product Image';
    mainImg.style.opacity = '1';
    mainImg.style.transform = 'scale(1)';
  }

  const angleText = document.getElementById('modalAngleText');
  if (angleText) {
    angleText.textContent = `Angle 1 of ${currentModalGallery.length} • Front View`;
  }

  const rail = document.getElementById('modalThumbnailsRail');
  if (rail) {
    const angleNames = ['Front View', 'Side Profile', 'Back / Camera View', 'Detail Angle'];
    rail.innerHTML = currentModalGallery.map((url, idx) => `
      <button 
        type="button"
        onclick="switchModalProductImage(${idx}, this)"
        onmouseenter="switchModalProductImage(${idx}, this)"
        title="View ${angleNames[idx] || 'Angle ' + (idx + 1)}"
        class="modal-thumb-btn w-13 h-13 sm:w-14 sm:h-14 rounded-xl border-2 ${idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'} overflow-hidden shadow-sm shrink-0 transition-all p-0.5 bg-white flex items-center justify-center cursor-pointer group"
      >
        <img src="${url}" alt="Angle ${idx + 1}" class="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-200">
      </button>
    `).join('');
  }

  // Titles & Brand Link
  const storeLink = document.getElementById('modalProductStoreLink');
  if (storeLink) storeLink.textContent = `Visit the ${p.brand} Store`;

  const nameEl = document.getElementById('modalProductName');
  if (nameEl) nameEl.textContent = p.name;

  // Rating Stars and Counts
  const avgScore = document.getElementById('modalAvgRatingScore');
  if (avgScore) avgScore.textContent = formatNumber(p.avgRating || 4.5);

  const starContainer = document.getElementById('modalAvgRatingStars');
  if (starContainer) starContainer.innerHTML = getStarHtml(p.avgRating || 4.5);

  const countLink = document.getElementById('modalReviewCountLink');
  const simulatedCount = (p.reviews ? p.reviews.length : 0) * 128 + 54;
  if (countLink) countLink.textContent = `(${formatNumber(simulatedCount)} ratings)`;

  // Pricing & Amazon Buy Box
  const priceEl = document.getElementById('modalProductPrice');
  if (priceEl) priceEl.textContent = formatCurrency(p.price);

  const mrpEl = document.getElementById('modalProductMRP');
  if (mrpEl) mrpEl.textContent = formatCurrency(mrp);

  // Dynamic Exchange calculations
  const maxExchangeOff = Math.min(Math.round(p.price * 0.231), 30050);
  const exchangePrice = Math.max(p.price - maxExchangeOff, 1000);

  const exchangeDiscountText = document.getElementById('exchangeDiscountText');
  if (exchangeDiscountText) exchangeDiscountText.textContent = `Up to ${formatCurrency(maxExchangeOff)} off`;

  const exchangePriceCalculated = document.getElementById('exchangePriceCalculated');
  if (exchangePriceCalculated) exchangePriceCalculated.textContent = formatCurrency(exchangePrice);

  const buyBoxPrice = document.getElementById('buyBoxPrice');
  if (buyBoxPrice) buyBoxPrice.textContent = formatCurrency(p.price);

  // Initialize exchange selection to 'without'
  selectExchangeOption('without');

  // Description Overview
  const descEl = document.getElementById('modalProductDesc');
  if (descEl) descEl.textContent = p.description;

  // Specs Table
  const specsEl = document.getElementById('modalProductSpecs');
  if (specsEl) {
    const specsMap = p.specs || {};
    const specEntries = Object.entries(specsMap);
    if (specEntries.length === 0) {
      specsEl.innerHTML = `<span class="col-span-full text-slate-400 italic">No specific attributes specified.</span>`;
    } else {
      specsEl.innerHTML = specEntries.map(([key, val]) => `
        <div class="flex justify-between items-center py-1.5 border-b border-slate-200/60 last:border-none">
          <span class="font-bold text-slate-600">${escapeHtml(key)}:</span>
          <span class="text-slate-800 text-right font-medium">${escapeHtml(val)}</span>
        </div>
      `).join('');
    }
  }

  // Hook Buy Box Buttons with Exchange consideration
  const addToCartBtn = document.getElementById('modalAddToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      const isExchange = currentExchangeSelected === 'with';
      const effectivePrice = isExchange ? exchangePrice : p.price;
      const note = isExchange ? 'With Exchange' : null;
      addToCart(p._id, effectivePrice, note);
    };
  }

  const buyNowBtn = document.getElementById('modalBuyNowBtn');
  if (buyNowBtn) {
    buyNowBtn.onclick = () => {
      const isExchange = currentExchangeSelected === 'with';
      const effectivePrice = isExchange ? exchangePrice : p.price;
      const note = isExchange ? 'With Exchange' : null;
      addToCart(p._id, effectivePrice, note);
      closeDetailModal();
      toggleCartDrawer(true);
    };
  }

  // Reviews List and Review Count Badge
  const reviewBadge = document.getElementById('modalReviewCountBadge');
  if (reviewBadge) reviewBadge.textContent = `${formatNumber(p.reviews ? p.reviews.length : 0)} ${t('reviewsCount')}`;

  renderReviewsList(p.reviews || [], p._id);
  if (addReviewForm) {
    addReviewForm.reset();
    if (currentUser) {
      const reviewAuthor = document.getElementById('reviewAuthor');
      if (reviewAuthor) reviewAuthor.value = `${currentUser.name} (Verified Buyer)`;
    }
  }
  setRatingValue(5);
}

function renderReviewsList(reviews, productId) {
  const listEl = document.getElementById('modalReviewsList');
  if (!listEl) return;

  if (reviews.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-6 bg-slate-50 rounded-xl text-slate-400 text-xs">
        <i class="fa-regular fa-comment-dots text-2xl mb-1 block"></i>
        ${t('noReviewsYet')}
      </div>
    `;
    return;
  }

  listEl.innerHTML = reviews.map((r) => {
    const stars = getStarHtml(r.rating);
    const dateFormatted = new Date(r.createdAt || Date.now()).toLocaleDateString(
      currentLang === 'hi' ? 'hi-IN' : (currentLang === 'bn' ? 'bn-IN' : 'en-US'),
      { month: 'short', day: 'numeric', year: 'numeric' }
    );

    return `
      <div class="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              ${escapeHtml(r.reviewerName.charAt(0).toUpperCase())}
            </div>
            <div>
              <span class="text-xs font-extrabold text-slate-800 block">${escapeHtml(r.reviewerName)}</span>
              <span class="inline-flex items-center text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.2 rounded-full">
                <i class="fa-solid fa-circle-check text-[9px] mr-1"></i>
                ${t('verifiedReview')}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-amber-500 text-xs">${stars}</span>
            <button 
              onclick="deleteReview('${productId}', '${r._id}')" 
              class="text-slate-400 hover:text-rose-600 text-xs ml-2 transition" 
              title="Delete review"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed pl-10">${escapeHtml(r.comment)}</p>
        <div class="text-[10px] text-slate-400 pl-10">${dateFormatted}</div>
      </div>
    `;
  }).join('');
}

function closeDetailModal() {
  if (!detailModal) return;
  detailModal.classList.add('hidden');
  detailModal.classList.remove('flex');
}

async function handleAddReviewSubmit(e) {
  e.preventDefault();
  if (!selectedProductForDetail) return;

  const reviewerName = document.getElementById('reviewAuthor').value.trim();
  const rating = Number(document.getElementById('reviewRatingVal').value);
  const comment = document.getElementById('reviewComment').value.trim();

  if (!reviewerName || !comment) {
    showToast('Please fill in your name and comment', 'warning');
    return;
  }

  try {
    const res = await fetch(`/api/products/${selectedProductForDetail._id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewerName, rating, comment })
    });

    const data = await res.json();
    if (data.success) {
      showToast('Review posted successfully!', 'success');
      viewProductDetails(selectedProductForDetail._id);
      loadProducts();
      loadStats();
    } else {
      showToast(data.message || 'Error posting review', 'error');
    }
  } catch (err) {
    console.error('Add review error:', err);
    showToast('Failed to add review', 'error');
  }
}

async function deleteReview(productId, reviewId) {
  if (!confirm('Are you sure you want to remove this review?')) return;

  try {
    const res = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      showToast('Review removed successfully', 'success');
      viewProductDetails(productId);
      loadProducts();
      loadStats();
    } else {
      showToast(data.message || 'Error deleting review', 'error');
    }
  } catch (err) {
    console.error('Delete review error:', err);
    showToast('Failed to delete review', 'error');
  }
}

// ======================== MODAL: ADD / EDIT PRODUCT ========================
function openProductForm(productId) {
  productForm.reset();
  specsContainer.innerHTML = '';
  document.getElementById('editProductId').value = '';

  if (productId) {
    const product = currentProducts.find((p) => p._id === productId);
    if (!product) return;

    productFormTitle.textContent = 'Edit Gadget Details';
    document.getElementById('editProductId').value = product._id;
    document.getElementById('formName').value = product.name;
    document.getElementById('formBrand').value = product.brand;
    document.getElementById('formCategory').value = product.category;
    document.getElementById('formPrice').value = product.price;
    document.getElementById('formInStock').value = product.inStock ? 'true' : 'false';
    document.getElementById('formImageUrl').value = product.imageUrl || '';
    document.getElementById('formDescription').value = product.description;

    const specs = product.specs || {};
    Object.entries(specs).forEach(([k, v]) => addSpecRow(k, v));
  } else {
    productFormTitle.textContent = 'Add New Gadget to Catalog';
    addSpecRow('Processor', '');
    addSpecRow('Storage', '');
  }

  productFormModal.classList.remove('hidden');
  productFormModal.classList.add('flex');
}

function closeProductForm() {
  productFormModal.classList.add('hidden');
  productFormModal.classList.remove('flex');
}

function addSpecRow(key = '', val = '') {
  const row = document.createElement('div');
  row.className = 'flex items-center gap-2 spec-row';
  row.innerHTML = `
    <input type="text" placeholder="Spec name (e.g. RAM)" value="${escapeHtml(key)}" class="spec-key w-1/2 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none">
    <input type="text" placeholder="Value (e.g. 16GB)" value="${escapeHtml(val)}" class="spec-val w-1/2 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none">
    <button type="button" class="text-slate-400 hover:text-rose-500 p-1 text-xs" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  `;
  specsContainer.appendChild(row);
}

async function handleProductFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('editProductId').value;
  const name = document.getElementById('formName').value.trim();
  const brand = document.getElementById('formBrand').value.trim();
  const category = document.getElementById('formCategory').value;
  const price = parseFloat(document.getElementById('formPrice').value);
  const inStock = document.getElementById('formInStock').value === 'true';
  const imageUrl = document.getElementById('formImageUrl').value.trim();
  const description = document.getElementById('formDescription').value.trim();

  const specs = {};
  const specRows = specsContainer.querySelectorAll('.spec-row');
  specRows.forEach((row) => {
    const k = row.querySelector('.spec-key').value.trim();
    const v = row.querySelector('.spec-val').value.trim();
    if (k && v) specs[k] = v;
  });

  const payload = {
    name,
    brand,
    category,
    price,
    inStock,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500',
    description,
    specs
  };

  try {
    let url = '/api/products';
    let method = 'POST';

    if (id) {
      url = `/api/products/${id}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      showToast(id ? 'Product updated successfully!' : 'Gadget added successfully!', 'success');
      closeProductForm();
      loadProducts();
      loadStats();
    } else {
      showToast(data.message || 'Error saving product', 'error');
    }
  } catch (err) {
    console.error('Submit error:', err);
    showToast('Failed to save product', 'error');
  }
}

async function deleteProduct(productId, productName) {
  if (!confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) return;

  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      showToast('Gadget deleted successfully', 'success');
      loadProducts();
      loadStats();
    } else {
      showToast(data.message || 'Error deleting gadget', 'error');
    }
  } catch (err) {
    console.error('Delete error:', err);
    showToast('Failed to delete gadget', 'error');
  }
}

// ======================== HELPERS ========================
function setupStarRating() {
  const container = document.getElementById('starRatingInput');
  if (!container) return;
  const stars = container.querySelectorAll('i');

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.val, 10);
      setRatingValue(val);
    });

    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.val, 10);
      highlightStars(val);
    });
  });

  container.addEventListener('mouseleave', () => {
    const currentVal = parseInt(document.getElementById('reviewRatingVal').value, 10);
    highlightStars(currentVal);
  });
}

function setRatingValue(val) {
  document.getElementById('reviewRatingVal').value = val;
  highlightStars(val);
}

function highlightStars(val) {
  const stars = document.getElementById('starRatingInput').querySelectorAll('i');
  stars.forEach((star) => {
    const starVal = parseInt(star.dataset.val, 10);
    if (starVal <= val) {
      star.className = 'fa-solid fa-star text-amber-400';
    } else {
      star.className = 'fa-solid fa-star text-slate-300';
    }
  });
}

function getStarHtml(rating) {
  let html = '';
  const rounded = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      html += '<i class="fa-solid fa-star"></i>';
    } else {
      html += '<i class="fa-regular fa-star text-slate-300"></i>';
    }
  }
  return html;
}

function resetFilters() {
  if (searchInput) searchInput.value = '';
  if (mobileSearchInput) mobileSearchInput.value = '';
  activeSearchQuery = '';
  activeCategory = 'All';
  activeSort = 'newest';
  activePriceRange = 'all';
  activeInStockOnly = false;
  if (sortSelect) sortSelect.value = 'newest';
  if (priceRangeSelect) priceRangeSelect.value = 'all';
  if (inStockCheckbox) inStockCheckbox.checked = false;

  categoryPills.forEach((p) => {
    if (p.dataset.category === 'All') {
      p.className = 'cat-pill px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white whitespace-nowrap shadow-sm';
    } else {
      p.className = 'cat-pill px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 whitespace-nowrap transition';
    }
  });
  loadProducts();
}

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-slate-800 text-white'
  };

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  toast.className = `${bgColors[type] || bgColors.info} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-xs font-bold pointer-events-auto transform transition duration-300 translate-y-4 opacity-0`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type]} text-sm"></i>
    <span>${escapeHtml(message)}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// ======================== WISHLIST SYSTEM ========================
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from your Wishlist', 'info');
  } else {
    wishlist.push(productId);
    showToast('Saved to your Wishlist! ❤️', 'success');
  }
  localStorage.setItem('gadgethub_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderProducts(currentProducts);
}

function updateWishlistUI() {
  const badge = document.getElementById('wishlistBadge');
  const drawerBadge = document.getElementById('wishlistDrawerCountBadge');
  if (badge) badge.textContent = formatNumber(wishlist.length);
  if (drawerBadge) drawerBadge.textContent = `${formatNumber(wishlist.length)} items`;
}

function openWishlistDrawer() {
  const backdrop = document.getElementById('wishlistDrawerBackdrop');
  const panel = document.getElementById('wishlistDrawerPanel');
  if (!backdrop || !panel) return;

  renderWishlistItems();
  backdrop.classList.remove('hidden');
  setTimeout(() => {
    panel.classList.remove('translate-x-full');
  }, 10);
}

function closeWishlistDrawer() {
  const backdrop = document.getElementById('wishlistDrawerBackdrop');
  const panel = document.getElementById('wishlistDrawerPanel');
  if (!backdrop || !panel) return;

  panel.classList.add('translate-x-full');
  setTimeout(() => {
    backdrop.classList.add('hidden');
  }, 300);
}

function renderWishlistItems() {
  const list = document.getElementById('wishlistItemsList');
  if (!list) return;

  const wishlistedProducts = currentProducts.filter(p => wishlist.includes(p._id));

  if (wishlistedProducts.length === 0) {
    list.innerHTML = `
      <div class="text-center py-16 text-slate-400">
        <div class="w-16 h-16 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
          <i class="fa-solid fa-heart-crack"></i>
        </div>
        <p class="font-bold text-slate-700">Your Wishlist is Empty</p>
        <p class="text-xs text-slate-400 mt-1">Click the heart icon on any gadget to save your favorites!</p>
      </div>
    `;
    return;
  }

  list.innerHTML = wishlistedProducts.map(p => `
    <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
      <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-14 h-14 object-cover rounded-xl border border-slate-200">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-slate-900 truncate">${escapeHtml(p.name)}</h4>
        <p class="text-xs font-black text-slate-800 mt-0.5">${formatCurrency(p.price)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="moveWishlistToCart('${p._id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-sm cursor-pointer">
            <i class="fa-solid fa-cart-plus text-[10px]"></i> Move to Cart
          </button>
          <button onclick="toggleWishlist('${p._id}'); renderWishlistItems();" class="text-rose-500 hover:text-rose-700 text-xs p-1 cursor-pointer" title="Remove">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function moveWishlistToCart(productId) {
  addToCart(productId);
  toggleWishlist(productId);
  renderWishlistItems();
}

function clearAllWishlist() {
  wishlist = [];
  localStorage.setItem('gadgethub_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderWishlistItems();
  renderProducts(currentProducts);
  showToast('Wishlist cleared', 'info');
}

function addAllWishlistToCart() {
  if (wishlist.length === 0) return;
  wishlist.forEach(id => addToCart(id));
  wishlist = [];
  localStorage.setItem('gadgethub_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  renderWishlistItems();
  renderProducts(currentProducts);
  closeWishlistDrawer();
  toggleCartDrawer(true);
  showToast('All wishlisted items moved to cart! 🛒', 'success');
}

// ======================== GADGET COMPARISON SYSTEM ========================
function toggleCompare(productId) {
  const index = compareList.indexOf(productId);
  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 2) {
      showToast('You can compare up to 2 gadgets at a time. Replacing earliest selection.', 'warning');
      compareList.shift();
    }
    compareList.push(productId);
  }
  updateCompareDock();
  renderProducts(currentProducts);
}

function updateCompareDock() {
  const dock = document.getElementById('compareDock');
  const countSpan = document.getElementById('compareCount');
  const thumbs = document.getElementById('compareThumbnails');
  if (!dock) return;

  if (compareList.length === 0) {
    dock.classList.add('hidden');
    return;
  }

  dock.classList.remove('hidden');
  if (countSpan) countSpan.textContent = compareList.length;

  const comparedProducts = currentProducts.filter(p => compareList.includes(p._id));
  if (thumbs) {
    thumbs.innerHTML = comparedProducts.map(p => `
      <div class="relative group">
        <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-9 h-9 object-cover rounded-xl border border-slate-600">
        <button onclick="toggleCompare('${p._id}')" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-[9px] shadow cursor-pointer">
          ×
        </button>
      </div>
    `).join('');
  }
}

function clearComparison() {
  compareList = [];
  updateCompareDock();
  renderProducts(currentProducts);
}

function openCompareModal() {
  if (compareList.length < 2) {
    showToast('Please select 2 gadgets to view side-by-side comparison', 'warning');
    return;
  }

  const modal = document.getElementById('compareModal');
  const container = document.getElementById('compareContentContainer');
  if (!modal || !container) return;

  const p1 = currentProducts.find(p => p._id === compareList[0]);
  const p2 = currentProducts.find(p => p._id === compareList[1]);
  if (!p1 || !p2) return;

  const specs1 = p1.specs || {};
  const specs2 = p2.specs || {};
  const allSpecKeys = Array.from(new Set([...Object.keys(specs1), ...Object.keys(specs2)]));

  const priceDiff = Math.abs(p1.price - p2.price);
  const cheaperProduct = p1.price < p2.price ? p1.name : (p2.price < p1.price ? p2.name : null);

  container.innerHTML = `
    <!-- Top Hardware Overview -->
    <div class="grid grid-cols-2 gap-6 pb-6 border-b border-slate-200">
      <!-- Gadget 1 -->
      <div class="space-y-3 text-center sm:text-left">
        <div class="relative h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
          <img src="${p1.imageUrl}" class="w-full h-full object-cover">
          <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm">${escapeHtml(p1.category)}</span>
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">${escapeHtml(p1.brand)}</span>
          <h4 class="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">${escapeHtml(p1.name)}</h4>
          <p class="text-xl font-black text-slate-900 mt-1">${formatCurrency(p1.price)}</p>
          <div class="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
            ${getStarHtml(p1.avgRating || 0)}
            <span class="text-slate-400 font-semibold ml-1">(${p1.reviews ? p1.reviews.length : 0})</span>
          </div>
        </div>
        <button onclick="addToCart('${p1._id}'); showToast('Added ${escapeHtml(p1.name)} to cart!', 'success');" class="btn-3d w-full py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>

      <!-- Gadget 2 -->
      <div class="space-y-3 text-center sm:text-left">
        <div class="relative h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
          <img src="${p2.imageUrl}" class="w-full h-full object-cover">
          <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm">${escapeHtml(p2.category)}</span>
        </div>
        <div>
          <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">${escapeHtml(p2.brand)}</span>
          <h4 class="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">${escapeHtml(p2.name)}</h4>
          <p class="text-xl font-black text-slate-900 mt-1">${formatCurrency(p2.price)}</p>
          <div class="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
            ${getStarHtml(p2.avgRating || 0)}
            <span class="text-slate-400 font-semibold ml-1">(${p2.reviews ? p2.reviews.length : 0})</span>
          </div>
        </div>
        <button onclick="addToCart('${p2._id}'); showToast('Added ${escapeHtml(p2.name)} to cart!', 'success');" class="btn-3d w-full py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>

    <!-- Comparative Insights Banner -->
    <div class="my-5 p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 text-xs text-indigo-900">
      <i class="fa-solid fa-lightbulb text-indigo-600 text-sm"></i>
      <div>
        <strong>Comparison Summary:</strong> 
        ${priceDiff > 0 ? `<span class="text-emerald-700 font-bold">${escapeHtml(cheaperProduct)}</span> is <strong class="text-emerald-700">${formatCurrency(priceDiff)}</strong> more affordable.` : 'Both gadgets have the exact same price.'}
      </div>
    </div>

    <!-- Technical Specifications Matrix -->
    <div class="space-y-2">
      <h5 class="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Technical Specifications Matrix</h5>
      <div class="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
        ${allSpecKeys.map(key => `
          <div class="grid grid-cols-12 py-2.5 px-3 hover:bg-slate-50/80 transition">
            <div class="col-span-4 font-bold text-slate-500">${escapeHtml(key)}</div>
            <div class="col-span-4 font-semibold text-slate-800 pr-2">${escapeHtml(specs1[key] || '—')}</div>
            <div class="col-span-4 font-semibold text-slate-800 pl-2 border-l border-slate-100">${escapeHtml(specs2[key] || '—')}</div>
          </div>
        `).join('')}
        ${allSpecKeys.length === 0 ? '<div class="p-4 text-center text-slate-400 text-xs">No specifications recorded for these products</div>' : ''}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ======================== COUPON ENGINE ========================
function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('Please enter a coupon code', 'warning');
    return;
  }

  const coupon = AVAILABLE_COUPONS[code];
  if (!coupon) {
    showToast('Invalid coupon code! Try SAVE10, FLAT500, or VIP2026', 'error');
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    showToast(`Order must be at least ₹${coupon.minOrder} to use ${code}`, 'warning');
    return;
  }

  appliedCoupon = { code, ...coupon };
  updateCouponUI();
  renderCart();
  showToast(`🎉 Coupon "${code}" applied successfully!`, 'success');
}

function removeCoupon() {
  appliedCoupon = null;
  const input = document.getElementById('couponInput');
  if (input) input.value = '';
  updateCouponUI();
  renderCart();
  showToast('Coupon removed', 'info');
}

function updateCouponUI() {
  const badge = document.getElementById('couponActiveBadge');
  const text = document.getElementById('couponActiveText');
  if (!badge) return;

  if (appliedCoupon) {
    badge.classList.remove('hidden');
    badge.classList.add('flex');
    if (text) {
      text.textContent = appliedCoupon.type === 'percent' 
        ? `${appliedCoupon.code} Applied (${appliedCoupon.value}% OFF)` 
        : `${appliedCoupon.code} Applied (₹${appliedCoupon.value} OFF)`;
    }
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
}

// ======================== TAX INVOICE GENERATOR ========================
function viewOrderInvoice(orderId) {
  if (!currentUser || !currentUser.orders) return;
  const order = currentUser.orders.find(o => o.orderId === orderId);
  if (!order) {
    showToast('Order not found', 'error');
    return;
  }

  const modal = document.getElementById('invoiceModal');
  const container = document.getElementById('invoiceContent');
  if (!modal || !container) return;

  const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const subtotal = Math.round(order.totalAmount / 1.18);
  const gstAmount = order.totalAmount - subtotal;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const itemsRows = (order.items || []).map((it, idx) => `
    <tr class="border-b border-slate-100 text-xs">
      <td class="py-2.5 text-slate-500">${idx + 1}</td>
      <td class="py-2.5 font-bold text-slate-800">${escapeHtml(it.name)}</td>
      <td class="py-2.5 text-center text-slate-600">${it.quantity}</td>
      <td class="py-2.5 text-right font-semibold text-slate-700">${formatCurrency(it.price)}</td>
      <td class="py-2.5 text-right font-bold text-slate-900">${formatCurrency(it.price * it.quantity)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <!-- Invoice Header -->
    <div class="flex items-start justify-between border-b border-slate-200 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            <i class="fa-solid fa-leaf"></i>
          </div>
          <span class="text-lg font-black text-slate-900">GadgetHub Technologies</span>
        </div>
        <p class="text-[11px] text-slate-500">Official Tech & Smart Electronics Retail Platform</p>
        <p class="text-[11px] text-slate-400">GSTIN: 29AAACG1234F1Z8 | HSN: 8471</p>
      </div>

      <div class="text-right space-y-1">
        <span class="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded uppercase">Tax Invoice</span>
        <h4 class="text-sm font-black text-slate-900 mt-1">INV-${escapeHtml(order.orderId)}</h4>
        <p class="text-[11px] text-slate-500">Date: ${dateStr}</p>
      </div>
    </div>

    <!-- Billed To & Shipping -->
    <div class="grid grid-cols-2 gap-6 py-2">
      <div class="space-y-1">
        <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer / Billed To:</span>
        <p class="text-xs font-bold text-slate-900">${escapeHtml(currentUser.name)}</p>
        <p class="text-[11px] text-slate-500">${escapeHtml(currentUser.email)}</p>
        <p class="text-[11px] text-slate-500">${escapeHtml(currentUser.phone || '+91 98765 43210')}</p>
      </div>
      <div class="space-y-1 text-right sm:text-left">
        <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Delivery Destination:</span>
        <p class="text-xs font-bold text-slate-900">${escapeHtml(order.shippingAddress || currentUser.address || 'Standard Verified Address')}</p>
        <p class="text-[11px] text-emerald-700 font-bold"><i class="fa-solid fa-circle-check"></i> Standard Insured Delivery</p>
      </div>
    </div>

    <!-- Items Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-200 text-[10px] uppercase font-black text-slate-400">
            <th class="py-2">#</th>
            <th class="py-2">Description</th>
            <th class="py-2 text-center">Qty</th>
            <th class="py-2 text-right">Unit Price</th>
            <th class="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Summary & GST Breakdown -->
    <div class="flex items-start justify-between pt-4 border-t border-slate-200">
      <div class="space-y-1">
        <div class="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl inline-block text-[11px] text-emerald-900">
          <p class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-stamp text-emerald-600"></i> Payment Verified & Recorded</p>
          <p class="text-[10px] text-emerald-700 mt-0.5">Verified Reference ID: ${escapeHtml(order._id || order.orderId)}</p>
        </div>
      </div>

      <div class="w-56 space-y-1.5 text-xs">
        <div class="flex justify-between text-slate-500">
          <span>Net Amount:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="flex justify-between text-slate-500">
          <span>CGST (9%):</span>
          <span>${formatCurrency(cgst)}</span>
        </div>
        <div class="flex justify-between text-slate-500">
          <span>SGST (9%):</span>
          <span>${formatCurrency(sgst)}</span>
        </div>
        <div class="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
          <span>Total Paid:</span>
          <span>${formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoiceModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ======================== 9. AGENTIC AI COPILOT SYSTEM ========================
let agentChatHistory = [];
let isAgentThinking = false;

function toggleAgentDrawer(show) {
  const drawer = document.getElementById('agentDrawer');
  const backdrop = document.getElementById('agentDrawerBackdrop');
  if (!drawer) return;

  if (show) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    // Initialize welcome message if empty
    if (agentChatHistory.length === 0) {
      renderAgentWelcomeMessage();
    }
    const input = document.getElementById('agentInputText');
    if (input) setTimeout(() => input.focus(), 300);
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function renderAgentWelcomeMessage() {
  const container = document.getElementById('agentMessagesContainer');
  if (!container) return;

  const welcomeHtml = `
    <div class="agent-msg-box flex gap-3 text-xs leading-relaxed">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="flex-1 space-y-2">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-xs flex items-center gap-1.5">
              GadgetAgent AI
              <span class="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black">Autonomous</span>
            </span>
            <span class="text-[10px] text-slate-400">Action Copilot</span>
          </div>
          <p class="text-slate-600">
            Hello! I am your <strong>Agentic AI Copilot</strong>. Unlike standard chatbots, I have <strong>autonomous tool-use capabilities</strong> to execute live actions across this store on your behalf:
          </p>
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 font-bold text-slate-700">
              <i class="fa-solid fa-code-compare text-indigo-500"></i> Compare Top Specs
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 font-bold text-slate-700">
              <i class="fa-solid fa-tags text-emerald-500"></i> Negotiate Best Coupon
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 font-bold text-slate-700">
              <i class="fa-solid fa-camera text-cyan-500"></i> Multi-Angle Inspector
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-1.5 font-bold text-slate-700">
              <i class="fa-solid fa-cart-arrow-down text-purple-500"></i> Smart Cart Bundles
            </div>
          </div>
          <p class="text-[11px] text-slate-500">
            Click any shortcut below or ask me in plain English!
          </p>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = welcomeHtml;
}

function clearAgentChat() {
  agentChatHistory = [];
  renderAgentWelcomeMessage();
  showToast('Agent chat history cleared', 'info');
}

function triggerQuickAgentGoal(promptText) {
  const input = document.getElementById('agentInputText');
  if (input) input.value = promptText;
  handleAgentFormSubmit(new Event('submit'));
}

async function handleAgentFormSubmit(e) {
  if (e) e.preventDefault();
  if (isAgentThinking) return;

  const input = document.getElementById('agentInputText');
  if (!input) return;

  const prompt = input.value.trim();
  if (!prompt) return;

  input.value = '';
  appendUserAgentMessage(prompt);

  await executeAgentQuery(prompt);
}

function appendUserAgentMessage(text) {
  const container = document.getElementById('agentMessagesContainer');
  if (!container) return;

  const userHtml = `
    <div class="flex justify-end gap-2.5 text-xs">
      <div class="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3 rounded-2xl rounded-tr-xs shadow-sm max-w-[85%] font-medium">
        ${escapeHtml(text)}
      </div>
      <div class="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold shrink-0 text-xs">
        <i class="fa-solid fa-user"></i>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', userHtml);
  container.scrollTop = container.scrollHeight;
}

async function executeAgentQuery(prompt) {
  isAgentThinking = true;
  const container = document.getElementById('agentMessagesContainer');

  // Render thinking indicator with pulsating agent radar
  const thinkingId = 'agentThinking_' + Date.now();
  const thinkingHtml = `
    <div id="${thinkingId}" class="flex gap-3 text-xs">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
        <i class="fa-solid fa-brain"></i>
      </div>
      <div class="bg-white p-3.5 rounded-2xl border border-indigo-200 shadow-sm flex items-center gap-2.5 text-indigo-900 font-bold">
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
        <span>Agent synthesizing plan & querying catalog...</span>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', thinkingHtml);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch('/api/agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        context: {
          cartCount: cart.length,
          comparedCount: compareList.length
        }
      })
    });

    const data = await res.json();
    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) thinkingEl.remove();

    if (data.success && data.data) {
      renderAgentResponse(data.data);
      if (data.data.actions && data.data.actions.length > 0) {
        executeAgentAutonomousActions(data.data.actions);
      }
    } else {
      renderAgentFallbackResponse(prompt);
    }
  } catch (err) {
    console.warn('Agent API fallback:', err);
    const thinkingEl = document.getElementById(thinkingId);
    if (thinkingEl) thinkingEl.remove();
    renderAgentFallbackResponse(prompt);
  } finally {
    isAgentThinking = false;
  }
}

function renderAgentResponse(agentData) {
  const container = document.getElementById('agentMessagesContainer');
  if (!container) return;

  const { reply, thoughtProcess, actions, recommendedProducts } = agentData;

  // Build Thought Trace HTML
  let thoughtTraceHtml = '';
  if (thoughtProcess && thoughtProcess.length > 0) {
    const stepsHtml = thoughtProcess.map(t => {
      let icon = 'fa-arrow-right';
      let colorClass = 'text-slate-400';
      if (t.type === 'execute') {
        icon = 'fa-bolt';
        colorClass = 'text-emerald-400 font-bold';
      } else if (t.type === 'query') {
        icon = 'fa-database';
        colorClass = 'text-cyan-400';
      } else if (t.type === 'optimize') {
        icon = 'fa-tags';
        colorClass = 'text-amber-400';
      }
      return `<p class="${colorClass} flex items-start gap-1.5"><i class="fa-solid ${icon} text-[10px] mt-0.5 shrink-0"></i><span>${escapeHtml(t.text)}</span></p>`;
    }).join('');

    thoughtTraceHtml = `
      <div class="bg-slate-950 text-slate-200 rounded-xl p-3 text-[11px] font-mono border border-slate-800 shadow-inner space-y-1.5">
        <div class="flex items-center justify-between text-indigo-400 font-bold border-b border-slate-800 pb-1 text-[10px]">
          <span class="flex items-center gap-1.5">
            <i class="fa-solid fa-brain text-amber-400"></i>
            Agent Thought & Execution Trace
          </span>
          <span class="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
            ${(actions || []).length} Action${(actions || []).length === 1 ? '' : 's'}
          </span>
        </div>
        <div class="space-y-1 pt-1">
          ${stepsHtml}
        </div>
      </div>
    `;
  }

  // Build Recommended Product Cards
  let productCardsHtml = '';
  if (recommendedProducts && recommendedProducts.length > 0) {
    productCardsHtml = `
      <div class="space-y-2 pt-1">
        <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Targeted Gadgets:</p>
        <div class="space-y-2">
          ${recommendedProducts.map(p => `
            <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-indigo-300 transition">
              <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 shrink-0 border border-slate-100">
              <div class="min-w-0 flex-1">
                <h5 class="text-xs font-bold text-slate-900 truncate">${escapeHtml(p.name)}</h5>
                <p class="text-[11px] font-black text-emerald-700 mt-0.5">${formatCurrency(p.price)}</p>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button onclick="viewProductDetails('${p._id}')" class="px-2 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition" title="Inspect Angles">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button onclick="addToCart('${p._id}')" class="px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition" title="Add to Cart">
                  <i class="fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const agentHtml = `
    <div class="agent-msg-box flex gap-3 text-xs leading-relaxed">
      <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
        <i class="fa-solid fa-robot"></i>
      </div>
      <div class="flex-1 space-y-2.5">
        <div class="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          ${thoughtTraceHtml}
          <div class="text-slate-800 leading-normal space-y-1">
            ${reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </div>
          ${productCardsHtml}
        </div>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', agentHtml);
  container.scrollTop = container.scrollHeight;
}

// Client-side Autonomous Action Dispatcher
function executeAgentAutonomousActions(actions) {
  if (!actions || !Array.isArray(actions)) return;

  actions.forEach(action => {
    switch (action.type) {
      case 'FILTER_CATALOG': {
        const { category, maxPrice } = action.payload;
        if (category) {
          selectCategory(category);
        }

        if (maxPrice !== undefined && maxPrice !== null) {
          const priceSelect = document.getElementById('priceFilterSelect');
          if (priceSelect) {
            if (maxPrice <= 30000) activePriceRange = 'under30k';
            else if (maxPrice <= 100000) activePriceRange = '30kTo100k';
            else activePriceRange = 'all';
            priceSelect.value = activePriceRange;
          }
          loadProducts();
        }

        const grid = document.getElementById('productsContainer');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast(`🤖 GadgetAgent: Filtered catalog to ${category || 'Top Picks'}!`, 'info');
        break;
      }

      case 'COMPARE_PRODUCTS': {
        const { productIds } = action.payload;
        if (productIds && productIds.length >= 2) {
          compareList = productIds.slice(0, 2);
          updateCompareDock();
          setTimeout(() => {
            openCompareModal();
          }, 400);
          showToast('🤖 GadgetAgent: Loaded Side-by-Side Comparison Matrix!', 'success');
        }
        break;
      }

      case 'OPEN_PRODUCT': {
        const { productId, angleIndex } = action.payload;
        if (productId) {
          viewProductDetails(productId);
          if (angleIndex !== undefined) {
            setTimeout(() => {
              switchModalProductImage(angleIndex);
            }, 500);
          }
          showToast('🤖 GadgetAgent: Focused Product Gallery & Angles!', 'info');
        }
        break;
      }

      case 'ADD_TO_CART_WITH_COUPON': {
        const { product, coupon } = action.payload;
        if (product) {
          addToCart(product._id);
          if (coupon) {
            appliedCoupon = coupon;
            saveCart();
            renderCart();
          }
          setTimeout(() => {
            toggleCartDrawer(true);
          }, 400);
          showToast(`🤖 GadgetAgent: Added to cart with coupon ${coupon}!`, 'success');
        }
        break;
      }

      case 'ADD_BUNDLE_TO_CART': {
        const { products, coupon } = action.payload;
        if (products && Array.isArray(products)) {
          products.forEach(p => addToCart(p._id));
          if (coupon) {
            appliedCoupon = coupon;
            saveCart();
            renderCart();
          }
          setTimeout(() => {
            toggleCartDrawer(true);
          }, 400);
          showToast(`🤖 GadgetAgent: Added bundle with coupon ${coupon}!`, 'success');
        }
        break;
      }

      default:
        console.log('Unknown agent action:', action);
    }
  });
}

// Client-side fallback if offline
function renderAgentFallbackResponse(prompt) {
  const p = prompt.toLowerCase();
  let fallbackReply = `I have received your goal: "${prompt}". You can explore our catalog, compare gadgets side-by-side, or use the quick action shortcuts below!`;
  let samplePicks = currentProducts.slice(0, 2);

  if (p.includes('compare') || p.includes('vs')) {
    const phones = currentProducts.filter(x => x.category === 'Smartphones');
    if (phones.length >= 2) {
      executeAgentAutonomousActions([{
        type: 'COMPARE_PRODUCTS',
        payload: { productIds: [phones[0]._id, phones[1]._id] }
      }]);
      fallbackReply = `I autonomously loaded **${phones[0].name}** and **${phones[1].name}** into the comparison matrix!`;
      samplePicks = [phones[0], phones[1]];
    }
  } else if (p.includes('cart') || p.includes('coupon') || p.includes('add')) {
    const pick = currentProducts[0] || { _id: '1', name: 'AirPods Pro', price: 24900, imageUrl: '' };
    executeAgentAutonomousActions([{
      type: 'ADD_TO_CART_WITH_COUPON',
      payload: { product: pick, coupon: 'VIP2026' }
    }]);
    fallbackReply = `Added **${pick.name}** to your cart with VIP coupon **VIP2026** (15% OFF)!`;
    samplePicks = [pick];
  }

  renderAgentResponse({
    reply: fallbackReply,
    thoughtProcess: [
      { step: 1, type: 'perceive', text: `Perceived: "${prompt}"` },
      { step: 2, type: 'execute', text: 'Executing local autonomous agent dispatch...' }
    ],
    actions: [],
    recommendedProducts: samplePicks
  });
}

window.toggleAgentDrawer = toggleAgentDrawer;
window.clearAgentChat = clearAgentChat;
window.triggerQuickAgentGoal = triggerQuickAgentGoal;
window.handleAgentFormSubmit = handleAgentFormSubmit;
