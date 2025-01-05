import axios from 'axios';
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  // Using useRef to reference form fields
  const nameRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    let valid = true;
    let errorMessages = { name: '', username: '', email: '', password: '' };

    if (!formData.name) {
      valid = false;
      errorMessages.name = 'Name is required';
      nameRef.current?.focus(); // Focus on name input if there's an error
    }
    if (!formData.username) {
      valid = false;
      errorMessages.username = 'Username is required';
      usernameRef.current?.focus(); // Focus on username input if there's an error
    }
    if (!formData.email) {
      valid = false;
      errorMessages.email = 'Email is required';
      emailRef.current?.focus(); // Focus on email input if there's an error
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      valid = false;
      errorMessages.email = 'Email is invalid';
      emailRef.current?.focus(); // Focus on email input if it's invalid
    }
    if (!formData.password) {
      valid = false;
      errorMessages.password = 'Password is required';
      passwordRef.current?.focus(); // Focus on password input if there's an error
    } else if (formData.password.length < 8) {
      valid = false;
      errorMessages.password = 'Password must be at least 6 characters';
      passwordRef.current?.focus(); // Focus on password input if it's too short
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {

      try {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/register`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        // Navigate to the login page after successful registration
        navigate('/login');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error submitting the form:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            ref={nameRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            ref={usernameRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            ref={emailRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            ref={passwordRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>
      <div className="text-center text-md mt-8 text-indigo-600 border-indigo-300/40 bg-indigo-200/70 p-2 rounded-md shadow-sm shadow-indigo-300 hover:border-2 hover:shadow-none">
        <Link to="/login" className="">
          Already have an account? Login here.
        </Link>
      </div>
    </div>
  );
};

export default Register;
