import { Product, CategoryInfo, DiscountCode, Order, Review, User } from '../types';

import heroImg from '../assets/images/hero_cap_streetwear_1791343159316.jpg';
import classicBaseballImg from '../assets/images/product_classic_baseball_1791343174954.jpg';
import nySnapbackImg from '../assets/images/product_ny_snapback_1791343189156.jpg';
import urbanSnapbackImg from '../assets/images/product_urban_snapback_1791343301888.jpg';
import vintageDadImg from '../assets/images/product_vintage_dad_1791343263123.jpg';
import denimBucketImg from '../assets/images/product_denim_bucket_1791343201371.jpg';
import sportsTruckerImg from '../assets/images/product_sports_trucker_1791343277334.jpg';
import embroideredWaveImg from '../assets/images/product_embroidered_wave_1791343289132.jpg';
import crownLimitedImg from '../assets/images/product_crown_limited_1791343211771.jpg';

export { heroImg };

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Black Classic Baseball Cap',
    category: 'Baseball Caps',
    description: 'The definitive minimalist headwear staple. Structured 6-panel silhouette cut from 100% brushed cotton twill, featuring a pre-curved visor, embroidered tonal eyelets, and an antiqued brass metal slide closure.',
    image: classicBaseballImg,
    gallery: [classicBaseballImg, urbanSnapbackImg, embroideredWaveImg],
    price: 299,
    originalPrice: 399,
    stock: 45,
    rating: 4.8,
    reviewCount: 142,
    colors: [
      { name: 'Matte Black', hex: '#111827' },
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Pure White', hex: '#F9FAFB' }
    ],
    isFeatured: true,
    isBestSeller: true,
    specs: {
      material: '100% Heavy Brushed Cotton Twill',
      crown: 'Structured 6-Panel Mid-Profile',
      closure: 'Antiqued Brass Buckle with Tuck-In Strap',
      visor: 'Permacurv® Memory Visor',
      origin: 'Crafted in Roxas, Oriental Mindoro, Philippines'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-002',
    name: 'New York Snapback',
    category: 'Snapback Caps',
    description: 'Iconic street pedigree meets modern luxury. High-profile flat brim snapback accented with high-density 3D tonal embroidery on front crown and contrast moisture-wicking royal blue sweatband inside.',
    image: nySnapbackImg,
    gallery: [nySnapbackImg, urbanSnapbackImg, crownLimitedImg],
    price: 499,
    originalPrice: 599,
    stock: 28,
    rating: 4.9,
    reviewCount: 98,
    colors: [
      { name: 'Royal Blue & Black', hex: '#2563EB' },
      { name: 'Stealth Black', hex: '#111827' },
      { name: 'Heather Gray', hex: '#6B7280' }
    ],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    specs: {
      material: '80% Acrylic / 20% Wool Blend',
      crown: 'High-Profile Structured Crown with Buckram',
      closure: 'Adjustable 7-Hole Snapback',
      visor: 'Flat Stiffened Street Brim with Green Underbrim',
      origin: 'Imported Materials, Hand-Finished in Roxas, Oriental Mindoro'
    },
    createdAt: '2026-02-01'
  },
  {
    id: 'prod-003',
    name: 'Urban Street Snapback',
    category: 'Snapback Caps',
    description: 'Engineered for contemporary city life. Asphalt gray textured weave with reinforced front panels, matte black rubberized patch, and an aerodynamic brim designed to maintain rigidity across heavy wear.',
    image: urbanSnapbackImg,
    gallery: [urbanSnapbackImg, nySnapbackImg, classicBaseballImg],
    price: 599,
    originalPrice: 750,
    stock: 22,
    rating: 4.7,
    reviewCount: 64,
    colors: [
      { name: 'Asphalt Gray', hex: '#4B5563' },
      { name: 'Pitch Black', hex: '#0B0F17' },
      { name: 'Crimson Edge', hex: '#991B1B' }
    ],
    isFeatured: true,
    isBestSeller: false,
    specs: {
      material: 'Heavyweight Poly-Cotton Ripstop',
      crown: 'Structured High-Crown 6-Panel',
      closure: 'Dual-Row Heavy-Duty Snap',
      visor: 'Squared Flat Brim',
      origin: 'Roxas Coastal Streetwear Studio, Oriental Mindoro'
    },
    createdAt: '2026-02-14'
  },
  {
    id: 'prod-004',
    name: 'Vintage Dad Hat',
    category: 'Dad Hats',
    description: 'Effortless vintage relaxed silhouette. Garment-washed soft cotton unconstructed crown that contours naturally to your head from day one. Finished with subtle tonal side logo and woven fabric clasp.',
    image: vintageDadImg,
    gallery: [vintageDadImg, classicBaseballImg, denimBucketImg],
    price: 399,
    originalPrice: 480,
    stock: 50,
    rating: 4.9,
    reviewCount: 185,
    colors: [
      { name: 'Washed Khaki', hex: '#A3907C' },
      { name: 'Faded Olive', hex: '#556B2F' },
      { name: 'Vintage Black', hex: '#1F2937' },
      { name: 'Desert Sand', hex: '#D2B48C' }
    ],
    isFeatured: true,
    isBestSeller: true,
    specs: {
      material: '100% Chino Washed Cotton',
      crown: 'Unstructured Low-Profile Soft Crown',
      closure: 'Fabric Strap with Antiqued Metal Grommet',
      visor: 'Natural Curve Visor',
      origin: 'Mindoro Vintage Wash Lab, Roxas'
    },
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-005',
    name: 'Denim Bucket Hat',
    category: 'Bucket Hats',
    description: 'Japanese raw denim inspired wide-brim bucket hat. Tailored concentric rim stitching provides structured shape without rigidity. Features interior cotton herringbone taping and breathable eyelet ports.',
    image: denimBucketImg,
    gallery: [denimBucketImg, vintageDadImg, crownLimitedImg],
    price: 449,
    originalPrice: 550,
    stock: 19,
    rating: 4.8,
    reviewCount: 76,
    colors: [
      { name: 'Raw Indigo', hex: '#1E3A8A' },
      { name: 'Washed Black Denim', hex: '#262626' },
      { name: 'Ecru Natural', hex: '#E5E7EB' }
    ],
    isFeatured: true,
    isNewArrival: true,
    specs: {
      material: '12oz Raw Selvedge-Style Cotton Denim',
      crown: 'Round Flat-Top Bucket Crown',
      closure: 'Fitted (Medium 57cm / Large 59cm)',
      visor: 'Downward Sloping Reinforced Rim',
      origin: 'Artisanal Denim Workshop, Roxas, Oriental Mindoro'
    },
    createdAt: '2026-02-20'
  },
  {
    id: 'prod-006',
    name: 'Sports Trucker Cap',
    category: 'Trucker Caps',
    description: 'Maximum ventilation meet athletic urban presence. High-grade breathable polymesh rear quadrants with padded foam front crown, contrast underbill, and an antimicrobial sweatband that handles tropical heat with ease.',
    image: sportsTruckerImg,
    gallery: [sportsTruckerImg, classicBaseballImg, urbanSnapbackImg],
    price: 350,
    originalPrice: 420,
    stock: 35,
    rating: 4.6,
    reviewCount: 52,
    colors: [
      { name: 'Stealth Black Mesh', hex: '#111827' },
      { name: 'White & Cobalt', hex: '#2563EB' },
      { name: 'Wolf Gray', hex: '#4B5563' }
    ],
    isFeatured: false,
    isBestSeller: false,
    specs: {
      material: 'Polyester Foam Front + High-Tenacity Poly Mesh',
      crown: 'Mid-Profile Structured A-Frame',
      closure: 'Adjustable Poly Snap Clasp',
      visor: 'Curved Visor with 6-Row Contrast Stitching',
      origin: 'Performance Lab Roxas, Oriental Mindoro'
    },
    createdAt: '2026-02-18'
  },
  {
    id: 'prod-007',
    name: 'Premium Embroidered Cap',
    category: 'Premium Embroidered Caps',
    description: 'Precision artisan needlework in over 45,000 stitches. Featuring dense metallic gunmetal thread on deep charcoal structured wool-blend panels, representing bespoke urban waves and crown iconography.',
    image: embroideredWaveImg,
    gallery: [embroideredWaveImg, crownLimitedImg, classicBaseballImg],
    price: 699,
    originalPrice: 850,
    stock: 14,
    rating: 5.0,
    reviewCount: 89,
    colors: [
      { name: 'Gunmetal Wave', hex: '#374151' },
      { name: 'Obsidian Gold', hex: '#0B0F17' },
      { name: 'Deep Navy', hex: '#1E293B' }
    ],
    isFeatured: true,
    isBestSeller: true,
    specs: {
      material: '85% Premium Acrylic / 15% Fine Wool',
      crown: 'Structured 6-Panel with Thermal Buckram',
      closure: 'Laser-Etched Metal Buckle Strap',
      visor: 'Semi-Curved Molded Visor with Microfiber Edge',
      origin: 'Master Needle Studio, Roxas, Oriental Mindoro'
    },
    createdAt: '2026-01-28'
  },
  {
    id: 'prod-008',
    name: 'Limited Edition Crown Cap',
    category: 'Limited Edition Caps',
    description: 'The pinnacle of CapZone luxury. Hand-numbered collector piece with 24K-tone metallic embroidery, Italian goat suede underbrim, silk-satin inner crown lining, and custom embossed magnetic presentation case.',
    image: crownLimitedImg,
    gallery: [crownLimitedImg, embroideredWaveImg, nySnapbackImg],
    price: 899,
    originalPrice: 1200,
    stock: 7,
    rating: 5.0,
    reviewCount: 43,
    colors: [
      { name: 'Crown Gold & Onyx', hex: '#D97706' },
      { name: 'Monochrome Luxe', hex: '#171717' }
    ],
    isFeatured: true,
    isNewArrival: true,
    isLimited: true,
    specs: {
      material: 'Ultra-Dense Tech Wool + Genuine Suede Underbrim',
      crown: 'Custom Sculptural Crown with Silk Satin Liner',
      closure: 'Brushed Titanium Slide Clasp with Leather Taper',
      visor: 'Signature Flat-To-Curve Hybrid Visor',
      origin: 'Limited Run of 250 Units Worldwide · Atelier Roxas, Oriental Mindoro'
    },
    createdAt: '2026-03-01'
  },
  {
    id: 'prod-009',
    name: 'Cyber Streetwear Fitted Cap',
    category: 'Streetwear Collection',
    description: 'Futuristic silhouette designed with reflective 3M piping along the crown seams. Engineered for low-light urban night life with moisture-wicking coolmax interior sweatband.',
    image: urbanSnapbackImg,
    gallery: [urbanSnapbackImg, classicBaseballImg],
    price: 649,
    originalPrice: 799,
    stock: 18,
    rating: 4.8,
    reviewCount: 37,
    colors: [
      { name: 'Reflective Carbon', hex: '#1E293B' },
      { name: 'Neon Cyber Blue', hex: '#2563EB' }
    ],
    isFeatured: false,
    specs: {
      material: 'Technical Nylon Ripstop with 3M Reflective Accents',
      crown: 'Unstructured Deep Crown',
      closure: 'Elasticated True-Fit Band',
      visor: 'Square Curved Visor',
      origin: 'CapZone Street Lab, Roxas Port Road, Oriental Mindoro'
    },
    createdAt: '2026-02-12'
  },
  {
    id: 'prod-010',
    name: 'Active Hydro Pro Sport Cap',
    category: 'Sports Collection',
    description: 'Featherlight 48-gram performance sports cap engineered with laser-perforated side cooling vents and UPF 50+ sun protection for marathon running and outdoor sports.',
    image: sportsTruckerImg,
    gallery: [sportsTruckerImg, classicBaseballImg],
    price: 420,
    originalPrice: 499,
    stock: 30,
    rating: 4.9,
    reviewCount: 51,
    colors: [
      { name: 'Pitch Matte Black', hex: '#111827' },
      { name: 'Arctic White', hex: '#F9FAFB' }
    ],
    isFeatured: false,
    specs: {
      material: 'Hydrophobic 4-Way Stretch Poly Spandex',
      crown: 'Aerodynamic Low-Profile Unstructured',
      closure: 'Low-Snag Velcro with Reflective Pull Tab',
      visor: 'Pliable Crushable Packable Visor',
      origin: 'Mindoro Aerotech Lab, Roxas, Oriental Mindoro'
    },
    createdAt: '2026-02-25'
  }
];

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Baseball Caps',
    slug: 'baseball-caps',
    description: 'Timeless 6-panel silhouettes with pre-curved visors and brushed cotton twill.',
    image: classicBaseballImg,
    itemCount: 14
  },
  {
    id: 'cat-2',
    name: 'Snapback Caps',
    slug: 'snapback-caps',
    description: 'Classic flat brims, raised 3D embroidery, and bold urban presence.',
    image: nySnapbackImg,
    itemCount: 18
  },
  {
    id: 'cat-3',
    name: 'Bucket Hats',
    slug: 'bucket-hats',
    description: 'Vintage raw denim, washed cotton twill, and modern 360-degree shade.',
    image: denimBucketImg,
    itemCount: 9
  },
  {
    id: 'cat-4',
    name: 'Dad Hats',
    slug: 'dad-hats',
    description: 'Relaxed unconstructed profiles with washed finishes and effortless comfort.',
    image: vintageDadImg,
    itemCount: 12
  },
  {
    id: 'cat-5',
    name: 'Trucker Caps',
    slug: 'trucker-caps',
    description: 'Padded foam front crowns with breathable high-tenacity mesh rear panels.',
    image: sportsTruckerImg,
    itemCount: 11
  },
  {
    id: 'cat-6',
    name: 'Premium Embroidered Caps',
    slug: 'premium-embroidered-caps',
    description: 'Bespoke high-density needlework with metallic thread and fine craftsmanship.',
    image: embroideredWaveImg,
    itemCount: 8
  },
  {
    id: 'cat-7',
    name: 'Limited Edition Caps',
    slug: 'limited-edition-caps',
    description: 'Individually numbered crown caps with suede underbrims and collector cases.',
    image: crownLimitedImg,
    itemCount: 4
  },
  {
    id: 'cat-8',
    name: 'Streetwear Collection',
    slug: 'streetwear-collection',
    description: 'Heavyweight textures, reflective 3M trims, and brutalist streetwear cuts.',
    image: urbanSnapbackImg,
    itemCount: 15
  },
  {
    id: 'cat-9',
    name: 'Sports Collection',
    slug: 'sports-collection',
    description: 'Ultralight moisture-wicking fabrics, laser ventilation, and UPF 50+ protection.',
    image: sportsTruckerImg,
    itemCount: 10
  }
];

export const INITIAL_DISCOUNTS: DiscountCode[] = [
  {
    code: 'CAPZONE10',
    discountType: 'percentage',
    value: 10,
    minSpend: 500,
    description: '10% off your entire order (Min spend ₱500)',
    active: true
  },
  {
    code: 'CROWN20',
    discountType: 'percentage',
    value: 20,
    minSpend: 1200,
    description: '20% off orders over ₱1,200',
    active: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    value: 99,
    minSpend: 499,
    description: 'Free Shipping discount voucher (₱99 value)',
    active: true
  },
  {
    code: 'VIPSTREET',
    discountType: 'fixed',
    value: 150,
    minSpend: 1000,
    description: '₱150 flat discount for streetwear collectors',
    active: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    userName: 'Marco Valenzuela',
    userEmail: 'marco.v@gmail.com',
    rating: 5,
    comment: 'The cotton twill texture is top tier. Fits like a glove right out of the box and the antiqued brass buckle feels substantial. Ordered directly here in Roxas, Oriental Mindoro and received it in pristine condition.',
    date: '2026-03-02',
    verifiedPurchase: true
  },
  {
    id: 'rev-02',
    productId: 'prod-001',
    userName: 'Aira Santos',
    userEmail: 'aira.s@gmail.com',
    rating: 5,
    comment: 'Minimalist perfection. Clean embroidery, sturdy curved visor that holds shape. Handled with care from the Roxas Mindoro hub.',
    date: '2026-02-28',
    verifiedPurchase: true
  },
  {
    id: 'rev-03',
    productId: 'prod-002',
    userName: 'Jericho Reyes',
    userEmail: 'jreyes@urbanph.com',
    rating: 5,
    comment: 'The 3D embroidery quality rivals genuine New Era 59FIFTYs. The royal blue accent underneath pops like crazy under the Mindoro sun.',
    date: '2026-02-24',
    verifiedPurchase: true
  },
  {
    id: 'rev-04',
    productId: 'prod-008',
    userName: 'Carlo Tan',
    userEmail: 'carlotan@gmail.com',
    rating: 5,
    comment: 'The Limited Edition Crown cap is an absolute work of art. The suede underbrim feels super premium and the magnetic box makes it feel like luxury designer goods right out of Roxas atelier.',
    date: '2026-03-04',
    verifiedPurchase: true
  },
  {
    id: 'rev-05',
    productId: 'prod-005',
    userName: 'Bea Dela Cruz',
    userEmail: 'bea.dc@gmail.com',
    rating: 5,
    comment: 'Best bucket hat I have owned. The raw denim is heavy duty but breathable. Great structure for coastal streetwear.',
    date: '2026-02-15',
    verifiedPurchase: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98421',
    userId: 'usr-customer-01',
    customerName: 'Juan Miguel dela Cruz',
    customerEmail: 'juan.delacruz@example.com',
    contactNumber: '+63 917 555 4321',
    shippingAddress: 'Rizal Street, Barangay Paclasan',
    city: 'Roxas, Oriental Mindoro',
    postalCode: '5212',
    items: [
      {
        id: 'item-1',
        orderId: 'ORD-98421',
        productId: 'prod-001',
        productName: 'Black Classic Baseball Cap',
        productImage: classicBaseballImg,
        price: 299,
        color: 'Matte Black',
        quantity: 1
      },
      {
        id: 'item-2',
        orderId: 'ORD-98421',
        productId: 'prod-002',
        productName: 'New York Snapback',
        productImage: nySnapbackImg,
        price: 499,
        color: 'Royal Blue & Black',
        quantity: 1
      }
    ],
    subtotal: 798,
    discountAmount: 79.8,
    discountCode: 'CAPZONE10',
    shippingFee: 0,
    totalAmount: 718.2,
    orderStatus: 'shipped',
    paymentMethod: 'gcash',
    paymentStatus: 'paid',
    createdAt: '2026-03-04 14:22',
    trackingNumber: 'CZ-849201PH',
    carrier: 'J&T Express Mindoro Express Priority',
    estimatedDelivery: 'Tomorrow by 3:00 PM',
    trackingHistory: [
      {
        status: 'Order Placed',
        timestamp: 'March 4, 2026 - 02:22 PM',
        location: 'CapZone Online Portal - Roxas, Oriental Mindoro',
        description: 'Payment confirmed via GCash. Order queued for fulfillment.',
        completed: true
      },
      {
        status: 'Quality Inspected & Packed',
        timestamp: 'March 4, 2026 - 04:45 PM',
        location: 'CapZone Flagship Hub, Port Road, Roxas, Oriental Mindoro',
        description: 'Custom crown mold inserted and sealed in CapZone branded moisture-proof box.',
        completed: true
      },
      {
        status: 'Handed to Courier',
        timestamp: 'March 5, 2026 - 09:10 AM',
        location: 'J&T Roxas Express Sorting Hub, Oriental Mindoro',
        description: 'Dispatched for automated scanning and regional distribution.',
        completed: true
      },
      {
        status: 'In Transit / Out for Delivery',
        timestamp: 'March 6, 2026 - 08:30 AM',
        location: 'Roxas Paclasan Distribution District, Oriental Mindoro',
        description: 'Rider assigned (Kuya Noel - 0918-123-4567). Out for delivery.',
        completed: false
      },
      {
        status: 'Delivered',
        timestamp: 'Estimated: March 6, 2026',
        location: 'Barangay Paclasan, Roxas, Oriental Mindoro',
        description: 'Pending signature upon receipt.',
        completed: false
      }
    ],
    notes: 'Please call mobile upon arrival at Rizal St. near the town plaza.'
  },
  {
    id: 'ORD-98420',
    userId: 'usr-customer-01',
    customerName: 'Juan Miguel dela Cruz',
    customerEmail: 'juan.delacruz@example.com',
    contactNumber: '+63 917 555 4321',
    shippingAddress: 'National Highway, Barangay Bagumbayan',
    city: 'Roxas, Oriental Mindoro',
    postalCode: '5212',
    items: [
      {
        id: 'item-3',
        orderId: 'ORD-98420',
        productId: 'prod-008',
        productName: 'Limited Edition Crown Cap',
        productImage: crownLimitedImg,
        price: 899,
        color: 'Crown Gold & Onyx',
        quantity: 1
      }
    ],
    subtotal: 899,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 899,
    orderStatus: 'delivered',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2026-02-18 10:15',
    trackingNumber: 'CZ-772190PH',
    carrier: 'CapZone Mindoro Express Fleet',
    estimatedDelivery: 'Delivered on Feb 20, 2026',
    trackingHistory: [
      {
        status: 'Order Placed',
        timestamp: 'Feb 18, 2026 - 10:15 AM',
        location: 'CapZone Online Portal - Roxas, Oriental Mindoro',
        description: 'Order confirmed with Visa Card.',
        completed: true
      },
      {
        status: 'Delivered',
        timestamp: 'Feb 20, 2026 - 02:40 PM',
        location: 'Barangay Bagumbayan, Roxas, Oriental Mindoro',
        description: 'Package received and signed by Juan Miguel dela Cruz.',
        completed: true
      }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-01',
    fullname: 'Juan Miguel dela Cruz',
    email: 'juan.delacruz@example.com',
    password: 'password123',
    address: 'Rizal Street, Barangay Paclasan',
    city: 'Roxas, Oriental Mindoro',
    postalCode: '5212',
    contactNumber: '+63 917 555 4321',
    role: 'user',
    memberSince: 'January 2026'
  },
  {
    id: 'usr-admin-01',
    fullname: 'CapZone Headmaster',
    email: 'admin@capzone.ph',
    password: 'adminpassword',
    address: 'CapZone Flagship Studio & Headwear Lab, Port Road, Barangay Dangay',
    city: 'Roxas, Oriental Mindoro',
    postalCode: '5212',
    contactNumber: '+63 920 888 9999',
    role: 'admin',
    memberSince: 'December 2025'
  }
];
