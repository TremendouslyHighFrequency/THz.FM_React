import React, { useState, useRef, useEffect } from 'react';
import { FrappeProvider } from 'frappe-react-sdk';
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import './App.css';
import { Notification, TrackItem } from './types';
import { getLoggedUser, getNotifications } from './components/api';
import Navbar from './components/Navbar';
import MyDocumentList from './components/MyDocumentList';
import THZIcon from './assets/Terahertz.png';


function App() {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    getLoggedUser()
      .then(loggedUser => getNotifications(loggedUser))
      .then(notificationData => setNotifications(notificationData))
      .catch(error => console.error(`Error fetching data: ${error}`));
  }, []);

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


  return (
    <div className="App">
      <FrappeProvider url='https://thz.fm'>
        <div className="App-header" style={{ minHeight: '72px' }}>
          <Navbar loggedUser={null} notifications={notifications} />
        </div>
        <body>
          <div className="App-body">
            <div className="page-content">
              <MyDocumentList />
              <div id="comment-container"></div>
            </div>
         </div>
        </body>

        <div className="App-footer">
          <div className="footer">
            <div>
              <img className="footer-logo" src={THZIcon} alt="logo" />
              <div className="footer-links">
              </div>
            </div>

            <div className="powered-by">Powered by Music</div>
          </div>
        </div>
      </FrappeProvider>
    </div>
  );
}

export default App;
