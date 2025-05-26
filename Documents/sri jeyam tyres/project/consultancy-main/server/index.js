import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Email service setup using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
 // Use TLS
  auth: {
    user: process.env.EMAIL_USER_SEND,
    pass: process.env.EMAIL_PASS_SEND
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 60000, // Increase timeout to 60 seconds
  greetingTimeout: 60000,
  socketTimeout: 60000
});

// Add retry logic for email sending with longer timeouts
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to send email (attempt ${attempt}/${maxRetries})`);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      lastError = error;
      console.error(`Email send attempt ${attempt} failed:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      });
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 2000; // Exponential backoff with longer delays
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Verify email configuration on startup with retry
const verifyEmailConfig = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Verifying email configuration (attempt ${attempt}/${maxRetries})`);
      await transporter.verify();
      console.log('Email server is ready to send messages');
      return true;
    } catch (error) {
      console.error(`Email verification attempt ${attempt} failed:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        responseCode: error.responseCode,
        response: error.response
      });
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 2000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  return false;
};

// Verify email configuration on startup
verifyEmailConfig().then(success => {
  if (!success) {
    console.error('Failed to verify email configuration after multiple attempts');
  }
});

// Add connection error handling
transporter.on('error', (error) => {
  console.error('Transporter error:', {
    message: error.message,
    code: error.code,
    command: error.command,
    responseCode: error.responseCode,
    response: error.response,
    stack: error.stack
  });
});

// Add connection success handling
transporter.on('connected', () => {
  console.log('Connected to email server');
});

// Add connection timeout handling
transporter.on('timeout', () => {
  console.error('Connection timeout');
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('Connected to MongoDB Atlas successfully');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Define MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const tyreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  vehicleCompatibility: [{ type: String }],
  size: { type: String, required: true },
  type: { type: String, required: true },
  features: [{ type: String }],
  stock: { type: Number, default: 0 },
  vehicleType: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  vehicleType: { type: String, required: true },
  vehicleModel: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true, enum: ['cod', 'online'] },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid'] },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Tyre = mongoose.model('Tyre', tyreSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Order = mongoose.model('Order', orderSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin privileges required' });
  }
  next();
};

// API Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false
    });
    
    await newUser.save();
    
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order confirmation email endpoint
app.post('/api/orders/send-confirmation', async (req, res) => {
  try {
    const { customerEmail, orderDetails } = req.body;

    // Ensure orderDetails contains products array
    if (!orderDetails || !Array.isArray(orderDetails.products)) {
      return res.status(400).json({ error: 'Invalid order details' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER_SEND,
      to: customerEmail,
      subject: 'Order Confirmation - Sri Jeyam Tyres',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order ID: ${orderDetails.orderId}</p>
        <h2>Order Summary:</h2>
        <ul>
          ${orderDetails.products.map(product => `
            <li>
              ${product.name} - 
              Quantity: ${product.quantity} - 
              Price: ₹${product.price}
            </li>
          `).join('')}
        </ul>
        <p>Total: ₹${orderDetails.total}</p>
        <p>Estimated Delivery: ${orderDetails.estimatedDelivery}</p>
      `
    };

    await sendEmailWithRetry(mailOptions);
    res.status(200).json({ message: 'Order confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ error: 'Failed to send order confirmation email' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Routes
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tyre Routes
app.get('/api/tyres', async (req, res) => {
  try {
    const tyres = await Tyre.find();
    res.json(tyres);
  } catch (error) {
    console.error('Get tyres error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tyres', authenticateToken, isAdmin, async (req, res) => {
  try {
    const newTyre = new Tyre(req.body);
    await newTyre.save();
    res.status(201).json(newTyre);
  } catch (error) {
    console.error('Create tyre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart Routes
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, name, price, image, quantity, vehicleType, vehicleModel } = req.body;
    
    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({ 
      userId: req.user.id,
      productId: productId
    });

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity;
      await cartItem.save();
      res.status(200).json({
        message: 'Cart updated successfully',
        cartItem
      });
    } else {
      // Create new cart item
      cartItem = new CartItem({
        userId: req.user.id,
        productId,
        name,
        price,
        image,
        quantity,
        vehicleType,
        vehicleModel
      });
      await cartItem.save();
      res.status(201).json({
        message: 'Item added to cart successfully',
        cartItem
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: 'Failed to add item to cart',
      error: error.message 
    });
  }
});

app.put('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOneAndUpdate(
      { userId: req.user.id, productId: req.params.productId },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({
      message: 'Cart updated successfully',
      cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      userId: req.user.id,
      productId: req.params.productId
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    // Validate required fields
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const validationErrors = [];
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      validationErrors.push('Order must contain at least one item');
    }
    
    if (!totalAmount || totalAmount <= 0) {
      validationErrors.push('Invalid total amount');
    }
    
    if (!shippingAddress) {
      validationErrors.push('Shipping address is required');
    } else {
      if (!shippingAddress.fullName) validationErrors.push('Full name is required');
      if (!shippingAddress.address) validationErrors.push('Address is required');
      if (!shippingAddress.city) validationErrors.push('City is required');
      if (!shippingAddress.state) validationErrors.push('State is required');
      if (!shippingAddress.pincode) validationErrors.push('PIN code is required');
      if (!shippingAddress.phone) validationErrors.push('Phone number is required');
    }
    
    if (!paymentMethod) {
      validationErrors.push('Payment method is required');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new order
    const newOrder = new Order({
      userId: req.user.id,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
      paymentStatus: 'Pending'
    });

    // Save the order
    await newOrder.save();

    // Get admin email
    const admin = await User.findOne({ isAdmin: true });
    if (!admin) {
      console.warn('No admin user found for order notification');
    }

    try {
      // Send email to user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Order Confirmation - Sri Jeyam Tyres',
        html: `
          <h2>Thank you for your order!</h2>
          <p>Dear ${user.username},</p>
          <p>Your order has been successfully placed. Here are your order details:</p>
          <ul>
            <li><strong>Order ID:</strong> ${newOrder._id}</li>
            <li><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</li>
            <li><strong>Items:</strong></li>
            <ul>${newOrder.items.map(item => `${item.name} x ${item.quantity}`).join('\n')}</ul>
            <li><strong>Total Amount:</strong> ₹${newOrder.totalAmount}</li>
            <li><strong>Payment Method:</strong> ${newOrder.paymentMethod}</li>
          </ul>
          <p>Shipping Address:</p>
          <p>
            ${newOrder.shippingAddress.fullName}<br>
            ${newOrder.shippingAddress.address}<br>
            ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.state} - ${newOrder.shippingAddress.pincode}<br>
            Phone: ${newOrder.shippingAddress.phone}
          </p>
          <p>We will notify you when your order ships.</p>
          <p>Thank you for choosing Sri Jeyam Tyres!</p>
        `
      };

      // Send email to admin if admin exists
      const adminMailOptions = admin ? {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: 'New Order Received - Sri Jeyam Tyres',
        html: `
          <h2>New Order Received</h2>
          <p>A new order has been placed. Here are the order details:</p>
          <ul>
            <li><strong>Order ID:</strong> ${newOrder._id}</li>
            <li><strong>Customer:</strong> ${user.username}</li>
            <li><strong>Customer Email:</strong> ${user.email}</li>
            <li><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</li>
            <li><strong>Items:</strong></li>
            <ul>${newOrder.items.map(item => `${item.name} x ${item.quantity}`).join('\n')}</ul>
            <li><strong>Total Amount:</strong> ₹${newOrder.totalAmount}</li>
            <li><strong>Payment Method:</strong> ${newOrder.paymentMethod}</li>
          </ul>
          <p>Shipping Address:</p>
          <p>
            ${newOrder.shippingAddress.fullName}<br>
            ${newOrder.shippingAddress.address}<br>
            ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.state} - ${newOrder.shippingAddress.pincode}<br>
            Phone: ${newOrder.shippingAddress.phone}
          </p>
        `
      } : null;

      // Send emails
      const emailPromises = [transporter.sendMail(userMailOptions)];
      if (adminMailOptions) {
        emailPromises.push(transporter.sendMail(adminMailOptions));
      }
      await Promise.all(emailPromises);
      console.log('Order confirmation emails sent successfully');
    } catch (emailError) {
      console.error('Error sending order confirmation emails:', emailError);
      // Don't fail the order if email sending fails
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Product Management Routes
app.put('/api/tyres/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const tyre = await Tyre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tyre) {
      return res.status(404).json({ message: 'Tyre not found' });
    }

    res.json(tyre);
  } catch (error) {
    console.error('Update tyre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tyres/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const tyre = await Tyre.findByIdAndDelete(req.params.id);

    if (!tyre) {
      return res.status(404).json({ message: 'Tyre not found' });
    }

    res.json({ message: 'Tyre deleted successfully' });
  } catch (error) {
    console.error('Delete tyre error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin signup route (for development only)
app.post('/api/auth/admin-signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true  // Set as admin
    });
    
    await newUser.save();
    
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Routes
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get order details
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is admin or the order belongs to the user
    if (!req.user.isAdmin && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Add error handling for port conflicts
const startServer = async () => {
  try {
    let currentPort = PORT;
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const server = app.listen(currentPort, () => {
          console.log(`Server is running on port ${currentPort}`);
          global.currentServerPort = currentPort;
        });

        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}`);
            currentPort++;
            server.close();
          } else {
            console.error('Server error:', error);
          }
        });

        return server;
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          currentPort++;
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Could not start server after ${maxAttempts} attempts`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Add a route to get the current server port
app.get('/api/server-port', (req, res) => {
  res.json({ port: global.currentServerPort || PORT });
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
