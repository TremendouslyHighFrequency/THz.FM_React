import React, { useEffect, useState, useRef, useContext } from 'react';
import { BellIcon, PersonIcon, VersionsIcon, RocketIcon, DownloadIcon, ClockIcon, MoonIcon, SunIcon } from '@primer/octicons-react';
import { NavbarProps, Notification } from '../types';
import { getUserImage } from './api';
import THZLogo from '../assets/THZFM_logo.png';
import THZIcon from '../assets/Terahertz.png';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';
import MeiliSearch from 'meilisearch'
import SearchResults from './SearchResults';
import { TxContext } from './txContext';


const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
})

const index = client.index('releases') // Replace with your index name

const Navbar = ({ loggedUser, notifications }: Omit<NavbarProps, 'txId'> & { notifications: Notification[] }) => {
  const [search, setSearch] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [searchResults, setSearchResults] = useState([]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const { txId, transactionConfirmed, setTransactionConfirmed } = useContext(TxContext);

  const getSearchResults = (searchTerm) => {
    console.log('Search Term:', searchTerm); // Log the search term
  
    if (searchTerm === '') {
      setSearchResults([]);
      return;
    }
    
    index.search(searchTerm)
      .then(searchResults => {
        console.log('Search Results:', searchResults.hits); // Log the search results
        setSearchResults(searchResults.hits);
      })
      .catch(error => {
        console.error('Error during search:', error); // Log any errors
      });
  }
  
  useEffect(() => {
    getSearchResults(search)
    console.log(searchResults)
  }, [search])

  useEffect(() => {
    if (loggedUser) {
      getUserImage(loggedUser)
        .then(image => setUserImage(image))
        .catch(error => console.error(`Error fetching user data: ${error}`));
    }

  
    if (txId) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get('https://api.ergoplatform.com/api/v1/transactions/' + txId);
          if (response.status === 200 && response.data) {
            set TransactionConfirmed(true);
            clearInterval(interval);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            set TransactionConfirmed(false);
          }
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [loggedUser, txId]);
  
  useEffect(() => {
    console.log('Search Results State:', searchResults) // Log the search results state
  }, [searchResults])


    // Add a state variable for the current theme
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Add a method to toggle the theme
    const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  
    // This will change the theme of the body
    useEffect(() => {
      document.body.dataset.theme = theme;
    }, [theme]);
  
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

      <button onClick={toggleTheme}>
        {theme === 'dark' ? <SunIcon size={24} /> : <MoonIcon size={24} />}
      </button>

      {txId && (
  <div>
    {!transactionConfirmed && <ClockIcon txId={txId} />}
    {transactionConfirmed && <DownloadIcon txId={txId} />}
  </div>
)}

          <SearchResults results={searchResults} />

          <div className="dapp-button">
            <ErgoDappConnector color="inkwell" />
          </div>

       

          <button className="bell" ref={notificationButtonRef} onClick={() => setDropdownVisible(prev => !prev)}>
            <BellIcon size={24} />
          </button>



          {dropdownVisible && <NotificationDropdown notifications={notifications} buttonRef={notificationButtonRef} dropdownVisible={dropdownVisible} setDropdownVisible={setDropdownVisible} />}
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
