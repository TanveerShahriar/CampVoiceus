import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
  });

  // Using useRef to reference form fields
  const identifierRef = useRef<HTMLInputElement | null>(null);
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
    let errorMessages = { identifier: '', password: '' };

    if (!formData.identifier) {
      valid = false;
      errorMessages.identifier = 'Email/Username is required';
      identifierRef.current?.focus(); // Focus on identifier input if there's an error
    }
    if (!formData.password) {
      valid = false;
      errorMessages.password = 'Password is required';
      passwordRef.current?.focus(); // Focus on password input if there's an error
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/login`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const { token } = response.data;
    
        // Store the token in local storage
        localStorage.setItem('token', token);
    
        // Navigate to the desired route
        navigate('/');
      } catch (error) {
        console.error('Error submitting the form:', error);
        alert('Failed to login. Please try again later.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email/Username
          </label>
          <input
            type="identifier"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleInputChange}
            ref={identifierRef}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
