import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { BellIcon, XIcon } from '@primer/octicons-react';
import { Notification } from './types';
import THZIcon from '../assets/Terahertz.png';

type Props = {
  notifications: Notification[];
  buttonRef: React.RefObject<HTMLButtonElement>;
};

const NotificationDropdown = ({ notifications, buttonRef, dropdownVisible, setDropdownVisible }: Props & { dropdownVisible: boolean; setDropdownVisible: (value: boolean) => void }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && buttonRef.current !== event.target) {
      setDropdownVisible(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    ReactDOM.createPortal(
      <div className="dropdown" ref={dropdownRef} style={buttonRef.current ? {
        right: `${window.innerWidth - buttonRef.current.getBoundingClientRect().right}px`,
        top: `${buttonRef.current.getBoundingClientRect().top + buttonRef.current.getBoundingClientRect().height}px`,
      } : {}}>
        {notifications && notifications.map((notification, index) => {
          let actionText;
          switch (notification.type) {
            case 'Share':
              actionText = `has shared ${notification.document_name}`;
              break;
            case 'Like':
              actionText = `has liked ${notification.document_name}`;
              break;
            case 'Comment':
              actionText = `has commented on ${notification.document_name}`;
              break;
            default:
              actionText = notification.type;
          }
          return (
            <div key={index} className="notification-item">
              <div className="notification">
                <img className="notification-image" src={notification.user_image || THZIcon} alt="user_image" />
                <span className="notification-text">{notification.from_user}</span>
                <span>{actionText}</span>
                <span>{notification.email_content}</span>
                {/* Add more fields as needed */}
              </div>
            </div>
          )
        })}
        <div className="dropdown-footer">
          <button className="view-notifications" onClick={() => setDropdownVisible(false)}>View all</button>
          <button className="close-notifications-item" onClick={() => setDropdownVisible(false)}><XIcon /> Close</button>
        </div>
      </div>,
      document.getElementById('portal') as Element
    )
  );
}

export default NotificationDropdown;
