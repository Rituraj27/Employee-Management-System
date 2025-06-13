import { connectToDatabase } from '../../config/mongodb';
import Employee from '../../models/Employee';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    switch (method) {
      case 'GET':
        try {
          const employees = await Employee.find({});
          res.status(200).json(employees);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      case 'POST':
        try {
          const employee = await Employee.create(req.body);
          res.status(201).json(employee);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error connecting to database' });
  }
}
