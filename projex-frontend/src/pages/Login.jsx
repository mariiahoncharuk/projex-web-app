import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("✅ [LOGIN] Attempting login:", email, password);

      // ✅ Send login request using axiosInstance
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      console.log("✅ [LOGIN] Response:", response.data);

      const { token, user } = response.data;

      // ✅ Check if tokens are returned
      if (!token) {
        setError("Login failed. No token received.");
        return;
      }

      // ✅ Store the JWT access token and role securely
      await localStorage.setItem('token', token);
      await localStorage.setItem('role', user.role);
      console.log("✅ [LOGIN] Token and role stored successfully.");

      // ✅ Ensure tokens are properly saved before redirecting
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setError("Error storing tokens. Please try again.");
        return;
      }

      console.log("✅ [LOGIN] Tokens stored successfully.");

      // ✅ Small delay to ensure the token is fully saved before redirecting
      setTimeout(() => {
        // ✅ Redirect based on user role
        if (user.role === 'director') navigate('/dashboard/director');
        else if (user.role === 'manager') navigate('/dashboard/manager');
        else if (user.role === 'worker') navigate('/dashboard/worker');
        else setError('Unknown role. Please contact support.');
      }, 50); // 50 milliseconds delay

    } catch (error) {
      console.error('❌ [LOGIN] Login failed:', error);

      if (error.response) {
        if (error.response.status === 400 || error.response.status === 404) {
          setError('Invalid email or password.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('An unknown error occurred.');
        }
      } else {
        setError('Cannot connect to the server. Make sure it is running.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>PROJEX</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>Login</button>
          <div style={styles.links}>
            <a href="#">Forgot password?</a>
            <span> | </span>
            <a href="/signup">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ Styling for the login page
const styles = {
  container: { 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f3f4f6' 
  },
  box: { 
    width: '100%', 
    maxWidth: 400, 
    padding: 32, 
    borderRadius: 12, 
    backgroundColor: 'white', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 24, 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  error: { 
    color: 'red', 
    fontSize: 14, 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 16 
  },
  input: { 
    padding: 12, 
    border: '1px solid #ccc', 
    borderRadius: 8, 
    fontSize: 16 
  },
  button: { 
    padding: 12, 
    backgroundColor: '#3b82f6', 
    color: 'white', 
    border: 'none', 
    borderRadius: 8, 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  links: { 
    marginTop: 16, 
    textAlign: 'center', 
    fontSize: 14 
  },
};

export default Login;
