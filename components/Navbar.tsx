import React, { useEffect, useState, useRef, useContext } from 'react';
import { BellIcon, PersonIcon, VersionsIcon, RocketIcon, DownloadIcon, ClockIcon, MoonIcon, SunIcon } from '@primer/octicons-react';
import { NavbarProps, Notification } from '../types';
import THZLogo from '../assets/THZFM_logo.png';
import THZLogoDark from '../assets/THZFM_logo_dark.png'; 
import { ErgoDappConnector } from 'ergo-dapp-connector';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';
import MeiliSearch from 'meilisearch'
import SearchResults from './SearchResults';
import { TxContext } from './txContext';
import { useFrappeAuth } from 'frappe-react-sdk';
import { Link, useNavigate } from "react-router-dom";
import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import { getUserImage } from './api';
import THZIcon from '../assets/Terahertz.png';
import { ActionBar } from './ActionBar';
import { UserDropdown } from './UserDropdown';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
})

const index = client.index('releases')

const LoginModal = ({ onSuccessfulLogin }) => {
  const navigate = useNavigate(); // Define the useNavigate hook here
  const { login, error } = useFrappeAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    try {
      const user = await login(username, password);
      onSuccessfulLogin(user);
      window.location.reload();
    } catch (err) {
      window.alert(err.message || "An error occurred during login.");
    }
  };

  const handleRegister = () => { // Define the handleRegister function
    navigate('/register'); // Redirect to the /register page
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>
          <PersonIcon size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="modal-content flex flex-col items-center" style={{ padding: '15px' }}>
          <img className="modal-logo my-auto mb-12" src={ THZIcon } alt="THZ.FM" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            style={{ display: 'block', padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ display: 'block', padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={handleLogin}
              style={{ marginRight: '10px', padding: '10px', backgroundColor: '#007BFF', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              Login
            </button>
            <button 
              // Add an event handler for registration if needed.
              onClick={handleRegister} style={{ marginLeft: '10px', padding: '10px', backgroundColor: '#79cd7a', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              Register
            </button>
          </div>
          {error && <p style={{ color: '#FF0000', marginTop: '10px' }}>{error.message}</p>}
          <Popover.Close as={Cross2Icon} style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '5px' }} />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};

const Navbar = ({ notifications }: { notifications: Notification[] }) => {
  const { currentUser, logout } = useFrappeAuth();
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null); // Renamed state variable
  const { txId, transactionConfirmed, setTransactionConfirmed } = useContext(TxContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [logo, setLogo] = useState(theme === 'dark' ? THZLogo : THZLogoDark);

  const getSearchResults = (searchTerm) => {
    if (searchTerm === '') {
      setSearchResults([]);
      return;
    }
    
    index.search(searchTerm)
      .then(searchResults => {
        setSearchResults(searchResults.hits);
      })
      .catch(error => {
        console.error('Error during search:', error);
      });
  }
  
  useEffect(() => {
    getSearchResults(search);
  }, [search]);

  useEffect(() => {
    if (currentUser) {
      getUserImage(currentUser).then(imageUrl => {
        setUserImageUrl(imageUrl);
      }).catch(error => {
        console.error('Failed to fetch user details:', error);
      });
    }

    if (txId) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get('https://api.ergoplatform.com/api/v1/transactions/' + txId);
          if (response.status === 200 && response.data) {
            setTransactionConfirmed(true);
            clearInterval(interval);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTransactionConfirmed(false);
          }
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [currentUser, txId]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setLogo(newTheme === 'dark' ? THZLogo : THZLogoDark);
    localStorage.setItem('theme', newTheme);
  }
  
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="navbar">
      <div className="navContainer">
        <a href="/">
          <img className="navbar-logo" src={logo} alt="logo" />
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
          <SearchResults results={searchResults} />
          {currentUser ? (
            <>
              <button className="bell" ref={notificationButtonRef} onClick={() => setDropdownVisible(prev => !prev)}>
                <BellIcon size={24} />
              </button>
              {dropdownVisible && <NotificationDropdown notifications={notifications} buttonRef={notificationButtonRef} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />}
          <button onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </button>

          {txId && (
            <div>
              {!transactionConfirmed && <ClockIcon className="nav-icon" size={24} txId={txId} />}
              {transactionConfirmed && <DownloadIcon className="nav-icon" size={24} txId={txId} />}
            </div>
          )}
               
              {currentUser ? (
            <> 
        <ActionBar />
        </>
          ) : (
            <div></div>
            )}
              <UserDropdown userImage={userImageUrl} />
            </>
          ) : (
            <LoginModal onSuccessfulLogin={(user) => {}} />
          )}
           <div className="dapp-button">
            <ErgoDappConnector color="inkwell" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
