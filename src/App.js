import './App.css';
import { useState } from 'react';
import CryptoJS from "crypto-js";

function App() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const callOtherApi = async () => {
    try {
      const response = await fetch("http://localhost:4000/user/profile", {
        method: "GET",
        credentials: "include", // Important for session cookies
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("User Data:", data);
      } else {
        console.error("Error fetching user data:", data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleLogin = async () => {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: hashedPassword }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);
        callOtherApi();
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App"  style={{margin: '150px'}}>
      <div style={{margin: '10px'}}>
        <label>Username</label>
        <input style={{marginLeft: '5px'}} value={username} onChange={(e) => setUserName(e.target.value)}></input>
      </div>
      <div style={{margin: '10px'}}>
        <label>Password</label>
        <input style={{marginLeft: '5px'}} value={password} type='password' onChange={(e) => setPassword(e.target.value)}></input>
      </div>
      <button onClick={() => handleLogin()}>Login</button>
    </div>
  );
}

export default App;
