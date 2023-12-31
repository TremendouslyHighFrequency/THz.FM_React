//React Imports
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ReleaseProvider } from './components/ReleaseContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

//Frappe Imports 
import { FrappeProvider } from 'frappe-react-sdk';

// Import the usePageContentStore hook
import { usePageContentStore } from './pageContentStore';

//App Requirement Imports
import './App.css';
import { Notification } from './types';
import { getLoggedUser, getNotifications } from './components/api';
import Navbar from './components/Navbar';

import { TxContext } from './components/txContext.js';

// Nav Imports
import Dashboard from './components/Dashboard';
import About from './components/About';
import Blog from './components/Blog';
import Home from './components/Home';
import Collection from './components/Collection';
import Workspace from './components/Workspace';
import SideNav from './components/FrontSideNav';
import Release from './components/Release';
import Roadmap from './components/Roadmap'; 
import Product from './components/Product';
import Artist from './components/Artist';
import Event from './components/Event';
import Venue from './components/Venue';
import Single from './components/Single';
import ManageReleases from './ManageReleases';
import CreateRelease from './components/CreateRelease';
import { getUserImage } from './components/api';
import Register from './components/Register';
import EditProfile from './components/EditProfile';
import AlbumReleaseListeningParty from './components/ListeningParty';
import ContractCompiler from './components/ContractCompiler';
import GreaseViewer from './components/Grease';

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


  const { navItems, links } = SideNav();

 return (
  <FrappeProvider url='https://thz.fm/'>
    <PayPalScriptProvider options={{ "client-id": "AQ6VDEXsgjtNcqDLSZIs-9NNKNMQ6ZTCwp1DjsIpzWqnmivwSFFfEaQW5jM2i8-pZ1andVyoKYHdZ_DK", "enable-funding": "venmo" }}>
     <ReleaseProvider>
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
  <Route key={item.route} path={item.route} element={<item.component />} />
))}
                    <Route path="/grease" element={<GreaseViewer />} />
                      <Route path="/releases/:title/by/:artist/:name/listening-party" element={<AlbumReleaseListeningParty />} />
                    <Route path="/create-release" element={<CreateRelease />}/>
                    <Route path="/manage-releases" element={<ManageReleases />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/contract-compiler" element={<ContractCompiler />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/us/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/roadmap" element={<Roadmap />} />
                    <Route path="/releases/:title/by/:artist/:name" element={<Release setCurrentTrack={setCurrentTrack} setCurrentTime={setCurrentTime} setDuration={setDuration} setTransaction={setTxId} />} />
                  </Routes>
                </div>
              </div>
  
            </div>
          </TxContext.Provider>
        </div>
      </Router>
      </ReleaseProvider>
      </PayPalScriptProvider>
    </FrappeProvider>
  );
}

export default App;
