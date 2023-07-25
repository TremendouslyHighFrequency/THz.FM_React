//React Imports
import React, { useState, useEffect } from 'react';

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

  const [route, setRoute] = useState([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Initialize route
    setRoute(frappe.get_route());

    // Listen for route changes
    window.onpopstate = () => {
      setRoute(frappe.get_route());
    };

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

  // Render the right component based on the current route
  let Component;
  switch (route[0]) {
    case 'Release':
      Component = Release;
      break;
    case 'Product':
      Component = Product;
      break;
    case 'Artist':
      Component = Artist;
      break;
    case 'Event':
      Component = Event;
      break;
    case 'Venue':
      Component = Venue;
      break;
    case 'Single':
      Component = Single;
      break;
    default:
      Component = null;  // Default component if no route matches
      break;
  }

  return (
    <FrappeProvider url='https://thz.fm'>
      <div className="App">
        <div className="App-header" style={{ minHeight: '72px' }}>
          <Navbar loggedUser={null} notifications={notifications} />
        </div>
        <div className="App-body">
          <div className="main-container">
            {links}
          </div>
          <div className="page-content">
            {Component ? <Component /> : <div>No Component for this route</div>}
            <div id="comment-container"></div>
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
      </div>
    </FrappeProvider>
  );
}

export default App;
