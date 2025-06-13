import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { employeeApi } from '../config/api';

export default function ViewEmployee() {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
  });

  const { id } = useParams();

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const result = await employeeApi.getById(id);
      setEmployee(result.data);
    } catch (error) {
      console.error('Error loading employee:', error);
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Employee Detail</h2>

          <div className='card'>
            <div className='card-header'>
              Details of Employee: {employee._id}
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  <b>First name: </b>
                  {employee.firstName}
                </li>
                <li className='list-group-item'>
                  <b>Last name: </b>
                  {employee.lastName}
                </li>
                <li className='list-group-item'>
                  <b>Email: </b>
                  {employee.emailId}
                </li>
              </ul>
            </div>
          </div>
          <Link to={'/'} className='btn btn-primary my-2'>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
