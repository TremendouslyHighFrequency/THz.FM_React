import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useFrappeAuth } from 'frappe-react-sdk';
import './component_styles/UserDropdown.css';
import { PersonIcon } from '@primer/octicons-react';

export const UserDropdown = ({ userImage }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useFrappeAuth();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          {currentUser ? (
            <img src={`https://thz.fm/${userImage}`} alt="User" style={{ marginLeft: '6px', borderRadius: '50%', width: '32px', height: '32px' }} />
          ) : (
            <PersonIcon size={24} />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
        <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/dashboard')}>
          Dashboard
        </DropdownMenu.Item>
        <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/manage-releases')}>
          Manage Releases
        </DropdownMenu.Item>
        <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/edit-profile')}>
          Edit Profile
        </DropdownMenu.Item>
        <DropdownMenu.Item
  className="DropdownMenuItem"
  onClick={() => {
    // Clear authentication-related data (this is just an example, adjust it based on your authentication setup)
    localStorage.removeItem('accessToken'); // Clear access token from local storage
    // You might need to clear cookies or other data depending on your authentication method

    // Navigate to the login page or home page
    navigate('/'); // Navigate to the desired location after logout
  }}
>
  Logout
</DropdownMenu.Item>
        {/* ... rest of your menu items ... */}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
