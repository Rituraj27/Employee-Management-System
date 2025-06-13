import { connectToDatabase } from '../../../config/mongodb';
import Employee from '../../../models/Employee';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          const employee = await Employee.findById(id);
          if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          res.status(200).json(employee);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      case 'PUT':
        try {
          const employee = await Employee.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          res.status(200).json(employee);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      case 'DELETE':
        try {
          const employee = await Employee.findByIdAndDelete(id);
          if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
          }
          res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error connecting to database' });
  }
}
