import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeApi } from '../config/api';

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching employees...');
      const result = await employeeApi.getAll();
      console.log('API Response:', result);

      if (Array.isArray(result.data)) {
        console.log('Setting employees:', result.data);
        setEmployees(result.data);
      } else {
        console.error('Expected array but got:', result.data);
        setEmployees([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      setError(error.response?.data?.message || 'Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const createTestEmployee = async () => {
    try {
      await employeeApi.create({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
      });
      loadEmployees();
    } catch (error) {
      console.error('Error creating test employee:', error);
      setError('Failed to create test employee');
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeApi.delete(id);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee');
    }
  };

  return (
    <div className='container'>
      <div className='py-4'>
        {loading && (
          <div className='alert alert-info' role='alert'>
            Loading employees...
          </div>
        )}
        {error && (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        )}
        {!loading && employees.length === 0 && (
          <div className='alert alert-warning' role='alert'>
            No employees found.
            <button
              className='btn btn-primary ms-3'
              onClick={createTestEmployee}
            >
              Create Test Employee
            </button>
          </div>
        )}
        <table className='table border shadow'>
          <thead>
            <tr>
              <th scope='col'>S.No</th>
              <th scope='col'>First Name</th>
              <th scope='col'>Last Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(employees) &&
              employees.map((emp, index) => (
                <tr key={emp._id}>
                  <th scope='row'>{index + 1}</th>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.emailId}</td>
                  <td>
                    <Link
                      to={`/viewEmployee/${emp._id}`}
                      className='btn btn-primary mx-2'
                    >
                      View
                    </Link>
                    <Link
                      to={`/editEmployee/${emp._id}`}
                      className='btn btn-outline-primary mx-2'
                    >
                      Edit
                    </Link>
                    <button
                      className='btn btn-danger mx-2'
                      onClick={() => deleteEmployee(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
