//React Imports
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useHistory } from 'react-router-dom';

//Frappe Imports 
import { FrappeProvider } from 'frappe-react-sdk';

//Ergo / Crypto Imports
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { MintNFT } from './components/MintNFT';

// Import the usePageContentStore hook
import { usePageContentStore } from './pageContentStore';

//App Requirement Imports
import './App.css';
import { Notification, TrackItem } from './types';
import { getLoggedUser, getNotifications } from './components/api';
import Navbar from './components/Navbar';

import { purchase as purchaseFn } from './components/purchase';
import { TxContext } from './components/txContext.js';

// Nav Imports
import Dashboard from './components/Dashboard';
import About from './components/About';
import Blog from './components/Blog';
import Home from './components/Home';
import Collection from './components/Collection';
import Workspace from './components/Workspace';
import SideNav from './components/FrontSideNav';
import FooterNav from './components/FooterNav';
import Release from './components/Release';
import Roadmap from './components/Roadmap'; 
import Product from './components/Product';
import Artist from './components/Artist';
import Event from './components/Event';
import Venue from './components/Venue';
import Single from './components/Single';
import CreateRelease from './CreateRelease';
import { getUserImage } from './components/api';
import Register from './components/Register';


function App() {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [txId, setTxId] = useState<string | null>(null); // Define the txId state and setTxId function here
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
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

       // Update the content of the page-content area
       usePageContentStore.setContent(content);


    } catch (err) {
      console.error(err);
    }
  };


  const { navItems, links } = SideNav();

 return (
  <FrappeProvider url='https://thz.fm'>
      <Router>
        <div className="App">
          <TxContext.Provider value={{ txId, transactionConfirmed, setTransactionConfirmed }}>
            <div className="App-header" style={{ minHeight: '72px' }}>
                <Navbar loggedUser={null} notifications={notifications} userImage={getUserImage} />
            </div>
            <div>
              <div className="App-body">
                <div className="main-container">
                  {links}
                </div>
                <div className="page-content">
                  {usePageContentStore((state) => state.content)}
                  <Routes>
                    {navItems.map(item => (
                      <Route key={item.route} path={item.route} element={React.createElement(item.component)} />
                    ))}
                    <Route path="/manage-releases" element={<CreateRelease />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/us/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/releases/:title/by/:artist/:name" element={<Release setCurrentTrack={setCurrentTrack} setCurrentTime={setCurrentTime} setDuration={setDuration} setTransaction={setTxId} />} />
                  </Routes>
                  <div id="comment-container"></div>
                </div>
              </div>
              <div className="footer">
              <FooterNav track={currentTrack} currentTime={currentTime} duration={duration} />
              </div>
            </div>

            {/* <div className="App-footer">
              <div className="footer">
                <div>
                  <div className="footer-links">
                    <FooterNav track={currentTrack} currentTime={currentTime} duration={duration} />
                  </div>
                </div>
              </div>
            </div> */}
          </TxContext.Provider>
        </div>
      </Router>
    </FrappeProvider>
  );
}

export default App;
