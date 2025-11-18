const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- In-Memory Database ---
let db = {
  vendors: [
    {
      id: 'VEND-001',
      username: 'vendor',
      password: 'password', // In a real app, this would be hashed
      profile: {
        vendorName: 'Creative Solutions Inc.',
        referredBy: 'EMP1024',
        contactPerson: 'Jane Doe',
        email: 'jane.doe@creativesolutions.com',
        mobileNumber: '+1-202-555-0184',
        cin: 'U74999DL2010PTC204683',
        registeredAddress: '123 Tech Park, Silicon Valley, CA 94043',
        businessCategory: 'IT Services & Consulting',
        operatingRegions: ['North America', 'Europe'],
        deliveryProvided: true,
        panNumber: 'ABCDE1234F',
        gstNumber: '27ABCDE1234F1Z5',
        bank: {
          ifsc: 'CITI0000002',
          bankName: 'Citibank',
          accountNumber: 'XXXXXX1234',
          upiId: 'jane.doe@citibank'
        },
        status: 'Verified',
        vendorId: 'VEND-001',
        loginDate: new Date().toISOString(),
        deliveryRangeKm: 50,
        deliveryZones: ['New York', 'San Francisco'],
        elementCategories: [
          { name: 'Laptops', maxQuantity: 100 },
          { name: 'Keyboards', maxQuantity: 500 }
        ]
      }
    }
  ],
  empanelment: {
    'VEND-001': {
      empanelmentId: 'EMP-001',
      initiatedBy: 'VEND-001',
      onboardingDate: '2023-01-15',
      empanelmentStatus: 'Approved',
      approvalDate: '2023-01-20',
      vendorCategory: 'Premium',
      serviceableRegions: ['North America', 'Europe'],
      documentsVerified: true,
      agreementAccepted: true,
      comments: 'All documents are in order.'
    }
  },
  workOrders: {
    'VEND-001': [
        { workOrderId: 'WO-2024-001', requestedBy: { name: 'John Smith', contact: 'jsmith@example.com' }, quantity: 100, deliveryLocation: 'New York, NY', deliveryDeadline: '2024-08-15', status: 'Pending', poId: 'PO-2024-001' },
        { workOrderId: 'WO-2024-002', requestedBy: { name: 'Alice Johnson', contact: 'ajohnson@example.com' }, quantity: 50, deliveryLocation: 'London, UK', deliveryDeadline: '2024-09-01', status: 'Accepted', poId: 'PO-2024-002' },
        { workOrderId: 'WO-2024-003', requestedBy: { name: 'Bob Brown', contact: 'bbrown@example.com' }, quantity: 200, deliveryLocation: 'Tokyo, JP', deliveryDeadline: '2024-08-20', status: 'Rejected', comments: 'Quantity too high for the deadline.' }
    ]
  },
  deliveryUpdates: {
    'VEND-001': [
        { workOrderId: 'WO-2024-002', currentStatus: 'Dispatched', dispatchDate: '2024-08-10', expectedDeliveryDate: '2024-08-25', escalationTriggered: false }
    ]
  },
  purchaseOrders: {
    'VEND-001': [
        { poId: 'PO-2024-001', poDate: '2024-07-20', poAmount: 50000, poStatus: 'Issued', linkedWorkOrders: ['WO-2024-001'], paymentStatus: 'Pending', deliveryTatBreach: false },
        { poId: 'PO-2024-002', poDate: '2024-07-22', poAmount: 25000, poStatus: 'Issued', linkedWorkOrders: ['WO-2024-002'], paymentStatus: 'Paid', paymentMode: 'NEFT', paymentReferenceNumber: 'AB12345678', deliveryTatBreach: true }
    ]
  }
};

// --- Middleware for Auth (simplified) ---
// In a real app, this would use JWTs. For now, we'll use a static vendor ID.
const getCurrentVendorId = (req) => 'VEND-001';

// --- API Routes ---

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const vendor = db.vendors.find(v => v.username === username && v.password === password);
  if (vendor) {
    res.json({ success: true, user: vendor.profile });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
    console.log('Received registration data:', req.body);
    // In a real app, you'd save this to the database.
    // For now, we just log it and return success.
    res.json({ success: true, message: 'Registration successful' });
});

// Profile
app.get('/api/vendor/profile', (req, res) => {
  const vendorId = getCurrentVendorId(req);
  const vendor = db.vendors.find(v => v.id === vendorId);
  if (vendor) {
    res.json(vendor.profile);
  } else {
    res.status(404).send('Vendor not found');
  }
});

app.put('/api/vendor/profile', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    const vendorIndex = db.vendors.findIndex(v => v.id === vendorId);
    if (vendorIndex > -1) {
        // Only update allowed fields, not status, vendorId etc.
        const { profile } = db.vendors[vendorIndex];
        const updatedProfile = { ...profile, ...req.body };
        db.vendors[vendorIndex].profile = updatedProfile;
        res.json(updatedProfile);
    } else {
        res.status(404).send('Vendor not found');
    }
});


// Empanelment
app.get('/api/vendor/empanelment', (req, res) => {
  const vendorId = getCurrentVendorId(req);
  res.json(db.empanelment[vendorId] || {});
});

// Work Orders
app.get('/api/vendor/work-orders', (req, res) => {
  const vendorId = getCurrentVendorId(req);
  res.json(db.workOrders[vendorId] || []);
});

app.put('/api/work-orders/:id', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    const { id } = req.params;
    const { status } = req.body;

    const orders = db.workOrders[vendorId];
    if (orders) {
        const order = orders.find(o => o.workOrderId === id);
        if (order) {
            order.status = status;
            res.json(order);
        } else {
            res.status(404).send('Work Order not found');
        }
    } else {
        res.status(404).send('Vendor not found');
    }
});

// Delivery Tracking
app.get('/api/vendor/deliveries', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    res.json(db.deliveryUpdates[vendorId] || []);
});

app.put('/api/deliveries/:workOrderId', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    const { workOrderId } = req.params;
    const updateData = req.body;

    const deliveries = db.deliveryUpdates[vendorId];
    if (deliveries) {
        const deliveryIndex = deliveries.findIndex(d => d.workOrderId === workOrderId);
        if (deliveryIndex > -1) {
            deliveries[deliveryIndex] = { ...deliveries[deliveryIndex], ...updateData };
            res.json(deliveries[deliveryIndex]);
        } else {
            // Create a new one if it doesn't exist
            const newDelivery = { workOrderId, ...updateData };
            deliveries.push(newDelivery);
            res.status(201).json(newDelivery);
        }
    } else {
        res.status(404).send('Vendor not found');
    }
});


// Payments
app.get('/api/vendor/payments', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    res.json(db.purchaseOrders[vendorId] || []);
});

app.put('/api/payments/:poId/invoice', (req, res) => {
    const vendorId = getCurrentVendorId(req);
    const { poId } = req.params;
    const { invoiceId, invoiceAmount, invoiceDate } = req.body;

    const pos = db.purchaseOrders[vendorId];
    if (pos) {
        const po = pos.find(p => p.poId === poId);
        if (po) {
            po.invoiceId = invoiceId;
            po.invoiceAmount = invoiceAmount;
            po.invoiceDate = invoiceDate;
            res.json(po);
        } else {
            res.status(404).send('Purchase Order not found');
        }
    } else {
        res.status(404).send('Vendor not found');
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});