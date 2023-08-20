import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { XIcon } from '@primer/octicons-react';
import { Notification } from './types';
import THZIcon from '../assets/Terahertz.png';

type Props = {
  notifications: Notification[];
  buttonRef: React.RefObject<HTMLButtonElement>;
  dropdownVisible: boolean;
  setDropdownVisible: (value: boolean) => void;
};

const NotificationDropdown = ({ notifications, buttonRef, dropdownVisible, setDropdownVisible }: Props) => {
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
        {notifications.length === 0 ? (
          <div className="no-notifications">There are no new notifications.</div>
        ) : (
          notifications.map((notification, index) => {
            let actionText;
            switch (notification.type) {
              case 'Share':
                actionText = ` shared ${notification.document_name}`;
                break;
              case 'Like':
                actionText = ` liked ${notification.document_name}`;
                break;
              case 'Alert':
                actionText = ` ❤️'d `;
                break;
              case 'Comment':
                actionText = ` commented on ${notification.document_name}`;
                break;
              default:
                actionText = notification.type;
            }
            return (
              <div key={index} className="notification-item">
                <div className="flex justify-between notification">
                  <img className="notification-image" src={notification.user_image || THZIcon} alt="user_image" />
                  <span className="notification-text">{notification.from_user.split('@')[0]}</span>
                  <span> {actionText} </span>
                  <span>{notification.email_content}</span>
                </div>
              </div>
            )
          })
        )}
        <div className="dropdown-footer">
          {notifications.length === 0 ? (
            <div></div>
          ) : (
            <>
              <button className="view-notifications" onClick={() => setDropdownVisible(false)}>View all</button>
              <button className="close-notifications-item" onClick={() => setDropdownVisible(false)}><XIcon /> Close</button>
            </>
          )}
        </div>
      </div>,
      document.getElementById('portal') as Element
    )
  );
}

export default NotificationDropdown;
