import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';

const Dashboard = () => {
  const {
    currentUser,
    logout,
  } = useFrappeAuth();

  return (
    <div className="content">
      {currentUser ? (
        <>
          <h1>Welcome {currentUser}</h1>
          <p>This is your Dashboard page.</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <h1>Welcome Guest</h1>
      )}
    </div>
  );
};

export default Dashboard;
