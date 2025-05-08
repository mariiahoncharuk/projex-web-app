import React, { useState } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('director');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceCode, setWorkspaceCode] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (role === 'manager' && !workspaceCode) {
      alert('Managers must enter a workspace code.');
      return;
    }

    if (role === 'manager' && workspaceName) {
      alert('Only Directors can create a workspace. Please contact your Director.');
      return;
    }

    console.log('Email:', email, 'Password:', password, 'Role:', role, 'Workspace Name:', workspaceName, 'Workspace Code:', workspaceCode);
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Register - PROJEX</h1>
        <form onSubmit={handleSignup} style={styles.form}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />

          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
            <option value="director">Director</option>
            <option value="manager">Manager</option>
          </select>

          {role === 'director' && (
            <input type="text" placeholder="Workspace Name" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} style={styles.input} required />
          )}

          {role === 'manager' && (
            <input type="text" placeholder="Workspace Code" value={workspaceCode} onChange={(e) => setWorkspaceCode(e.target.value)} style={styles.input} required />
          )}

          <button type="submit" style={styles.button}>Register</button>
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
  }
};

export default Signup;
