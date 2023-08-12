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
  const navigate = useNavigate();
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

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>
          <PersonIcon size={24} />
        </button>
      </Popover.Trigger>
      <Popover.Content>
        <div className="modal-content">
        <div className="w-full p-6 m-auto mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src={THZIcon} alt="THZ.FM" />
          </div>
          <form className="mt-6">
            <div>
              <label htmlFor="username" className="block text-sm text-gray-800">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm text-gray-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-6">
              <button onClick={handleLogin} className="w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                Sign In
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={handleRegister} className="w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                Register
              </button>
            </div>
            {error && <p className="mt-4 text-xs text-red-600">{error.message}</p>}
          </form>
          <p className="mt-8 text-xs font-light text-center text-gray-400">
            Don't have an account?{' '}
            <a
              href="#"
              onClick={handleRegister}
              className="font-medium text-gray-700 dark:text-gray-200 hover:underline cursor-pointer"
            >
              Create One
            </a>
          </p>
        </div>
        </div>
        <Popover.Close as={Cross2Icon} style={{ cursor: 'pointer', position: 'absolute', top: '5px', right: '5px' }} />
      </Popover.Content>
    </Popover.Root>
  );
};


const Navbar = ({ notifications }: { notifications: Notification[] }) => {
  const { currentUser, logout } = useFrappeAuth();
  const searchInputRef = useRef(null); // Create a reference for the search input field
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [userImageUrl, setUserImageUrl] = useState<string | null>(null); // Renamed state variable
  const { txId, transactionConfirmed, setTransactionConfirmed } = useContext(TxContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [logo, setLogo] = useState(theme === 'dark' ? THZLogo : THZLogoDark);

  const handleSearchShortcut = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '.') {
      e.preventDefault(); // Prevent the default browser action
      setIsExpanded(true); // Expand the search bar
      searchInputRef.current.focus(); // Focus the search input field
    }
  };

  useEffect(() => {
    // Attach the event listener
    window.addEventListener('keydown', handleSearchShortcut);

    // Return a cleanup function to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleSearchShortcut);
    };
  }, []); // Make sure to pass in an empty array of dependencies

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
          <img className="navbar-logo mr-4" src={logo} alt="logo" />
        </a>
        {currentUser ? (
            <> 
        <ActionBar />
        </>
          ) : (
            <div></div>
            )}
        <div className="navbar-items">
          <input
            ref={searchInputRef} // Attach the ref to the input field
            className={`navbar-search ${isExpanded ? 'full-width' : ''}`}
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
          />
          <SearchResults results={searchResults} />
          <button onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
          </button>
          {txId && (
            <div>
              {!transactionConfirmed && <ClockIcon className="nav-icon" size={24} txId={txId} />}
              {transactionConfirmed && <DownloadIcon className="nav-icon" size={24} txId={txId} />}
            </div>
          )}
          <div className="dapp-button">
            <ErgoDappConnector color="inkwell" />
          </div>
          {currentUser ? (
            <>
              <button className="bell" ref={notificationButtonRef} onClick={() => setDropdownVisible(prev => !prev)}>
                <BellIcon size={24} />
              </button>
              {dropdownVisible && <NotificationDropdown notifications={notifications} buttonRef={notificationButtonRef} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />}
              <button className="bell"><a href="/collection"><VersionsIcon size={24} /></a></button>
              <Link to="/workspace"><RocketIcon size={24} /></Link>
              <UserDropdown userImage={userImageUrl} />
            </>
          ) : (
            <LoginModal onSuccessfulLogin={(user) => {}} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
