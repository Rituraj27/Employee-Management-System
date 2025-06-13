import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { employeeApi } from '../config/api';

export default function EditEmployee() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
  });

  const { firstName, lastName, emailId } = employee;

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadEmployee();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeApi.update(id, employee);
      navigate('/');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

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
          <h2 className='text-center m-4'>Edit Employee</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className='mb-3'>
              <label htmlFor='firstName' className='form-label'>
                First Name
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter your first name'
                name='firstName'
                required
                value={firstName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='lastName' className='form-label'>
                Last Name
              </label>
              <input
                type='text'
                className='form-control'
                placeholder='Enter your last name'
                name='lastName'
                required
                value={lastName}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='emailId' className='form-label'>
                Email
              </label>
              <input
                type='email'
                className='form-control'
                placeholder='Enter your email'
                name='emailId'
                required
                value={emailId}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button type='submit' className='btn btn-outline-primary'>
              Submit
            </button>
            <Link to='/' className='btn btn-outline-danger m-2'>
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
