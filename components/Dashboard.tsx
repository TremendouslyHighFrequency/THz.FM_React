import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';

const Dashboard = () => {
  const {
    currentUser
  } = useFrappeAuth();

  return (
    <div className="content">
      {currentUser ? (
        <>
          <h1>Welcome to your user dashboard, {currentUser}</h1>
        </>
      ) : (
        <h1>Please login to view this page.</h1>
      )}
    </div>
  );
};

export default Dashboard;
