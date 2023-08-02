import React, { useState, useRef, useEffect } from 'react';
import { router } from 'frappejs';
import ReactDOM from 'react-dom';

import { FrappeProvider } from 'frappe-react-sdk';
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { MintNFT } from './components/MintNFT';
import { usePageContentStore } from './pageContentStore';
import './App.css';
import { Notification, TrackItem } from './types';
import { getLoggedUser, getNotifications } from './components/api';
import Navbar from './components/Navbar';
import { purchase as purchaseFn } from './components/purchase';
import { TxContext } from './components/txContext.js';
import SideNav from './components/FrontSideNav';
import FooterNav from './components/FooterNav';
import Release from './components/Release'; 
import Releases from './components/Releases';
import Product from './components/Product';
import Artist from './components/Artist';
import Event from './components/Event';
import Venue from './components/Venue';
import Single from './components/Single';

// Add a route for the Releases component
router.add('releases', async () => {
  const releasesComponent = <Releases />;
  ReactDOM.render(releasesComponent, document.getElementById('content'));
});

// Add a route for the Release component
router.add('releases/:title/by/:artist/:name', async (params) => {
  const releaseComponent = <Release params={params} />;
  ReactDOM.render(releaseComponent, document.getElementById('content'));
});

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);
  const [txId, setTxId] = useState<string | null>(null); // Define the txId state and setTxId function here
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    getLoggedUser()
      .then(loggedUser => getNotifications(loggedUser))
      .then(notificationData => setNotifications(notificationData))
      .catch(error => console.error(`Error fetching data: ${error}`));
    router.show(window.location.hash);
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
    <FrappeProvider url='https://thz.fm'>
      <div className="App">
        <TxContext.Provider value={{ txId, transactionConfirmed, setTransactionConfirmed }}>
          <div className="App-header" style={{ minHeight: '72px' }}>
            <Navbar loggedUser={null} notifications={notifications} />
          </div>
          <div>
            <div className="App-body">
              <div className="main-container">
                {links}
              </div>
              <div className="page-content" id="content">
                {usePageContentStore((state) => state.content)}
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
        </TxContext.Provider>
      </div>
    </FrappeProvider>
  );
}

export default App;
