//React Imports
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Route, useHistory, useLocation } from 'react-router-dom';

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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

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

async function purchase() {
  // requests wallet access
  if (await ergoConnector.nautilus.connect()) {
    // get the current height from the the dApp Connector
    const height = await ergo.get_current_height();

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos()) // add inputs from dApp Connector
      .to(
        // Add output
        new OutputBuilder(
          "100000000",
          "9fjTtRPuaSXU3QuK73EH7w6dCd2Z8oPDnXz5qBptKpD6MUdwiZX"
        )
      )
      .sendChangeTo(await ergo.get_change_address()) // Set the change address to the user's default change address
      .payMinFee() // set minimal transaction fee
      .build() // build the transaction
      .toEIP12Object(); // converts the ErgoUnsignedTransaction instance to an dApp Connector compatible plain object

    // requests the signature
    const signedTx = await ergo.sign_tx(unsignedTx);

    // send the signed transaction to the mempool
    const txId = await ergo.submit_tx(signedTx);

    // prints the Transaction ID of the submitted transaction on the console
    console.log(txId);
  }
};

  const { navItems, links } = SideNav();

  return (
    <Router>
    <div className="App">
      <FrappeProvider url='https://thz.fm'>
        <div className="App-header" style={{ minHeight: '72px' }}>
          <Navbar loggedUser={null} notifications={notifications} />
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
    <Route path="/releases/:title/by/:artist" element={<Release />} />
</Routes>
              <div id="comment-container"></div>
            </div>
         </div>
        </div>
    
        <div className="App-footer">
          <div className="footer">
            <div>
              <div className="footer-links">
                <FooterNav />
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
