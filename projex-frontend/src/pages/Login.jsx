import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: handle login logic
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>PROJEX</h1>
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

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  box: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 12,
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: 12,
    border: '1px solid #ccc',
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 16,
  },
  links: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
};

export default Login;
