import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useNavigate } from 'react-router-dom';
import {
  HamburgerMenuIcon
} from '@radix-ui/react-icons';
import './component_styles/UserDropdown.css';

export const UserDropdown = () => {
    const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
    const [urlsChecked, setUrlsChecked] = React.useState(false);
    const [person, setPerson] = React.useState('pedro');
    const navigate = useNavigate();
  
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="IconButton" aria-label="Customise options">
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>
  
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/dashboard')}>
              Dashboard
            </DropdownMenu.Item>
            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/manage-releases')}>
              Manage Releases
            </DropdownMenu.Item>
            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => navigate('/me')}>
              Edit Profile
            </DropdownMenu.Item>
  
            {/* ... rest of your menu items ... */}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  };
  