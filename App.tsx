//React Imports
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Frappe Imports 
import { FrappeProvider } from 'frappe-react-sdk';

//Ergo / Crypto Imports
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { MintNFT } from './components/MintNFT';

//App Requirement Imports
import './App.css';
import { Notification, TrackItem } from './types';
import { getLoggedUser, getNotifications } from './components/api';
import Navbar from './components/Navbar';

import { purchase as purchaseFn } from './components/purchase';


// Nav Imports
import SideNav from './components/FrontSideNav';
import FooterNav from './components/FooterNav';
import Release from './components/Release'; 
import Product from './components/Product';
import Artist from './components/Artist';
import Event from './components/Event';
import Venue from './components/Venue';
import Single from './components/Single';

function App() {
  useEffect(() => {
    const route = frappe.get_route();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [txId, setTxId] = useState<string | null>(null); // Define the txId state and setTxId function here

  // Add state for the current track, current time, and duration
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    getLoggedUser()
      .then(loggedUser => getNotifications(loggedUser))
      .then(notificationData => setNotifications(notificationData))
      .catch(error => console.error(`Error fetching data: ${error}`));
  }, []);

  const handleButtonClick = async () => {
    try {
      await MintNFT();
    } catch (err) {
      console.error(err);
    }
  };

  const { navItems, links } = SideNav();

 return (
    <Router>
    <div className="App">
      <FrappeProvider url='https://thz.fm'>
        <div className="App-header" style={{ minHeight: '72px' }}>
            <Navbar loggedUser={null} notifications={notifications} setTxId={setTxId} />
        </div>
        <div>
        
 <div className="App-body">
           <div className="main-container">
           {links}
           </div>
            <div className="page-content">
            
            <Routes>
  {navItems.map(item => (
    <Route key={item.route} path={item.route} element={React.createElement(item.component)} />
  ))}
    <Route path="/releases/:title/by/:artist" element={<Release setCurrentTrack={setCurrentTrack} setCurrentTime={setCurrentTime} setDuration={setDuration} />} />
</Routes>
              <div id="comment-container"></div>
            </div>
         </div>
        </div>
    
        <div className="App-footer">
          <div className="footer">
            <div>
              <div className="footer-links">
                <FooterNav track={currentTrack} currentTime={currentTime} duration={duration} />
              </div>
            </div>
          </div>
        </div>
      </FrappeProvider>
    </div>
    </Router>
  );
}

export default App;
