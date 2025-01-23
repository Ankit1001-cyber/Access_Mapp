import React, { useState } from 'react';
import axios from 'axios';
import styles from '../Styles/profile.module.css';

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/profile', { name, email });
      setUser(response.data.user);
      setSuccess('Profile updated successfully.');
      setError('');
    } catch (error) {
      setError('Profile update failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className={styles.updateProfileContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Update Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Profile;
