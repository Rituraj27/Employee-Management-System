const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://employee-management-system-nn.vercel.app'
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://mahantonn:rituraj@employeemanagement.xd3ghtj.mongodb.net/';

console.log('Attempting to connect to MongoDB...');

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1); // Exit if cannot connect to database
  });

// Employee Schema
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    console.log('Creating employee with data:', req.body);
    const employee = new Employee(req.body);
    await employee.save();
    console.log('Employee created successfully:', employee);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    console.log('Fetching all employees...');
    const employees = await Employee.find();
    console.log('Found employees:', employees);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    console.log('Fetching employee with ID:', req.params.id);
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      console.log('Employee not found');
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.log('Found employee:', employee);
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    console.log('Updating employee with ID:', req.params.id);
    console.log('Update data:', req.body);
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      console.log('Employee not found for update');
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.log('Employee updated successfully:', employee);
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    console.log('Deleting employee with ID:', req.params.id);
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      console.log('Employee not found for deletion');
      return res.status(404).json({ message: 'Employee not found' });
    }
    console.log('Employee deleted successfully');
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel serverless deployment
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
