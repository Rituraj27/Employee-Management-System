import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { employeeApi } from '../config/api';

export default function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const result = await employeeApi.getAll();
      setEmployees(result.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await employeeApi.delete(id);
      loadEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className='container'>
      <div className='py-4'>
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
            {employees.map((emp, index) => (
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
