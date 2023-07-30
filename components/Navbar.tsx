import React, { useEffect, useState, useRef } from 'react';
import { BellIcon, PersonIcon, VersionsIcon, RocketIcon } from '@primer/octicons-react';
import { NavbarProps, Notification } from '../types';
import { getUserImage } from './api';
import THZLogo from '../assets/THZFM_logo.png';
import THZIcon from '../assets/Terahertz.png';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import NotificationDropdown from './NotificationDropdown';
import { checkTransaction } from './transactionMonitor';
import { DownloadIcon, ClockIcon } from '@primer/octicons-react'; // make sure to import the DownloadIcon


const Navbar = ({ loggedUser, notifications }: NavbarProps & { notifications: Notification[] }) => {
  const transactionConfirmed = checkTransaction();
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    if (loggedUser) {
      getUserImage(loggedUser)
        .then(image => setUserImage(image))
        .catch(error => console.error(`Error fetching user data: ${error}`));
    }
  }, [loggedUser]);

  return (
    <div className="navbar">
      <div className="navContainer">
        <a href="/">
          <img className="navbar-logo" src={THZLogo} alt="logo" />
        </a>
        <div className="navbar-items">
          <input
            className={`navbar-search ${isExpanded ? 'full-width' : ''}`}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
          />
          <div className="dapp-button">
            <ErgoDappConnector color="inkwell" />
          </div>
          {txId && (
        <div>
          {/* Replace <ProgressIcon> and <DownloadIcon> with the actual icons */}
          {!transactionConfirmed && <ClockIcon txId={txId} />}
          {transactionConfirmed && <DownloadIcon txId={txId} />}
        </div>
      )}
          <button className="bell" ref={notificationButtonRef} onClick={() => setDropdownVisible(prev => !prev)}>
            <BellIcon size={24} />
          </button>
          {dropdownVisible && <NotificationDropdown notifications={notifications} buttonRef={notificationButtonRef} />}
          <button className="bell"><a href="/collection"><VersionsIcon size={24} /></a></button>
          <a href="/collection"><RocketIcon size={24} /></a>  
          <a href="/me">
            {userImage ? (
              <img src={userImage} alt="User" style={{ borderRadius: '50%', width: '24px', height: '24px' }} />
            ) : (
              <PersonIcon size={24} />
            )}
          </a>
         
        </div>
      </div>
    </div>
  );
}

export default Navbar;
