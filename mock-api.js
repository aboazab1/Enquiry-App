const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for enquiries
let enquiries = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    subject: 'Product Inquiry',
    message: 'I am interested in learning more about your products. Could you please provide more information?',
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    subject: 'Support Request',
    message: 'I am experiencing issues with my recent order. The tracking information is not updating correctly.',
    status: 'in-progress',
    createdAt: new Date('2024-01-14T14:20:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z')
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1122334455',
    subject: 'Partnership Opportunity',
    message: 'We would like to explore potential partnership opportunities with your company.',
    status: 'resolved',
    createdAt: new Date('2024-01-10T16:45:00Z'),
    updatedAt: new Date('2024-01-12T11:30:00Z')
  }
];

let nextId = 4;

// Routes

// Get all enquiries
app.get('/api/enquiries', (req, res) => {
  res.json({
    success: true,
    data: enquiries,
    message: 'Enquiries retrieved successfully'
  });
});

// Get enquiry by ID
app.get('/api/enquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const enquiry = enquiries.find(e => e.id === id);
  
  if (!enquiry) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Enquiry not found'
    });
  }
  
  res.json({
    success: true,
    data: enquiry,
    message: 'Enquiry retrieved successfully'
  });
});

// Create new enquiry
app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'All fields are required'
    });
  }
  
  const newEnquiry = {
    id: nextId++,
    name,
    email,
    phone,
    subject,
    message,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  enquiries.push(newEnquiry);
  
  res.status(201).json({
    success: true,
    data: newEnquiry,
    message: 'Enquiry created successfully'
  });
});

// Update enquiry status
app.patch('/api/enquiries/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  
  const enquiry = enquiries.find(e => e.id === id);
  if (!enquiry) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Enquiry not found'
    });
  }
  
  if (!['pending', 'in-progress', 'resolved'].includes(status)) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Invalid status. Must be pending, in-progress, or resolved'
    });
  }
  
  enquiry.status = status;
  enquiry.updatedAt = new Date();
  
  res.json({
    success: true,
    data: enquiry,
    message: 'Status updated successfully'
  });
});

// Delete enquiry
app.delete('/api/enquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = enquiries.findIndex(e => e.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Enquiry not found'
    });
  }
  
  enquiries.splice(index, 1);
  
  res.json({
    success: true,
    data: null,
    message: 'Enquiry deleted successfully'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET    /api/enquiries - Get all enquiries`);
  console.log(`   GET    /api/enquiries/:id - Get enquiry by ID`);
  console.log(`   POST   /api/enquiries - Create new enquiry`);
  console.log(`   PATCH  /api/enquiries/:id/status - Update enquiry status`);
  console.log(`   DELETE /api/enquiries/:id - Delete enquiry`);
  console.log(`   GET    /health - Health check`);
});
