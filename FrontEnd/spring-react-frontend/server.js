const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Test route
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

// MongoDB Connection
const MONGODB_URI =
  'mongodb+srv://mahantonn:rituraj@employeemanagement.xd3ghtj.mongodb.net/EmployeeManagement?retryWrites=true&w=majority';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database name:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Employee Schema
const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    console.log('Fetching all employees...');
    const employees = await Employee.find().lean();
    console.log(`Found ${employees.length} employees`);
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    console.log('Creating new employee:', req.body);
    const employee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
    });
    const savedEmployee = await employee.save();
    console.log('Employee created successfully:', savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
      },
      { new: true, runValidators: true }
    ).lean();

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id).lean();
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Test employee creation route
app.post('/api/test/employee', async (req, res) => {
  try {
    console.log('Creating test employee...');
    const testEmployee = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john.doe@example.com',
    });
    const savedEmployee = await testEmployee.save();
    console.log('Test employee created:', savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error creating test employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/test`);
  console.log(`Test the API at http://localhost:${PORT}/api/test`);
});
