// Venues.jsx
import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';

const Dashboard = () => {
  const {
    currentUser,
    isValidating,
    isLoading,
    login,
    logout,
    error,
    updateCurrentUser,
    getUserCookie,
  } = useFrappeAuth();
  
  return (
    <div className="content">
      This is the Dashboard page.

      <button onClick={logout}>Logout</button>

    </div>
  );
};

export default Dashboard;

