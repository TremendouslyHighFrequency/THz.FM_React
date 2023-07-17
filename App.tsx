import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import THZLogo from './assets/THZFM_logo.png';
import THZIcon from './assets/Terahertz.png';
import './App.css';
import { FrappeProvider, useFrappeAuth, useFrappeGetDocList, useFrappeGetDoc } from 'frappe-react-sdk';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { BellIcon, PersonIcon, XIcon, VersionsIcon } from '@primer/octicons-react';
import axios from 'axios';

function App() {

  const [notifications, setNotifications] = useState([]);
  const notificationButtonRef = useRef(null);

useEffect(() => {
  axios.get('https://thz.fm/api/method/frappe.auth.get_logged_user')
    .then(response => {
      const loggedUser = response.data.message; 

      return axios.get(`https://thz.fm/api/resource/Notification Log?filters=[["Notification Log","for_user","=","${loggedUser}"]]&fields=["subject","email_content","type","document_type","read","document_name","attached_file","attachment_link","from_user", "from_user.user_image"]`);
    })
    .then(response => {
      const notificationData = response.data.data;
      setNotifications(notificationData);
    })
    .catch(error => {
      console.error(`Error fetching data: ${error}`);
    });
}, []);

  function purchase() {
    (async () => {
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
    })();
  };


type TrackItem = {
    title: string,
    track_artist: string
}

const MyDocumentList = () => {
    const [pageIndex, setPageIndex] = useState(0)
    const { data, error, isValidating } = useFrappeGetDocList<T>('Release' , {
        fields: ["title", "release_artist","release_artwork"],
        limit_start: pageIndex,
        /** Number of documents to be fetched. Default is 20  */
        limit: 10,
        /** Sort results by field and order  */
        orderBy: {
            field: "creation",
            order: 'desc'
        }
    });

    if (isValidating) {
        return <>Loading</>
    }
    if (error) {
        return <>{JSON.stringify(error)}</>
    }
    if (data && Array.isArray(data)) {
           return (
            <div className="albums-index">
                    {
                        data.map(({title, release_artist, release_artwork}, i) => (
                            <div key={i} className="album-card" style={{backgroundImage: `url(${release_artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                            <div className="album-text">
                                    <h4>{title}</h4>
                                    <p>{release_artist}</p>
                                </div>
</div>
                        ))
                    }
  <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
</div>
        )
    }
    return null
};

  const Navbar = ({ loggedUser }) => {
    const [search, setSearch] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const [userImage, setUserImage] = useState(null);

    // Define handleClickOutside here
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && notificationButtonRef.current !== event.target) {
        setDropdownVisible(false);
      }
    }

   useEffect(() => {
    if (loggedUser) {  
    axios.get(`https://thz.fm/api/Resource/User?fields=["user_image[0]"]&filters=[["User","owner","=","${loggedUser}"]]`)
        .then(response => {
          const userData = response.data.data;
          // assuming the image URL is the first element in the user_image array
          setUserImage(userData.user_image);
        })
        .catch(error => {
          console.error(`Error fetching user data: ${error}`);
        });
	}    
  }, [loggedUser]);

    useEffect(() => {
      const handleResize = () => {
        setDropdownVisible(false);
      };

      const handleScroll = () => {
        setDropdownVisible(false);
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


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
             <div className="dapp-button">
              <ErgoDappConnector color="cyan" />
            </div>
            <button className="bell" ref={notificationButtonRef} onClick={() => dropdownVisible || setDropdownVisible(true)}>
              <BellIcon size={24} />
            </button>

{dropdownVisible && ReactDOM.createPortal(
    <div className="dropdown" ref={dropdownRef} style={notificationButtonRef.current ? {
          right: `${window.innerWidth - notificationButtonRef.current.getBoundingClientRect().right}px`,
          top: `${notificationButtonRef.current.getBoundingClientRect().top + notificationButtonRef.current.getBoundingClientRect().height}px`,
        } : {}}>
          {notifications.map((notification, index) => {
            let actionText;
            switch (notification.type) {
              case 'Share':
                actionText = `has shared ${notification.document_name}`;
                break;
              case 'Like':
                actionText = `has liked ${notification.document_name}`;
                break;
              case 'Comment':
                actionText = `has commented on ${notification.document_name}`;
                break;
              default:
                actionText = notification.type;
            }
            return (
              <div key={index} className="notification-item">
                <div className="notification">
                  <img className="notification-image" src={notification.user_image || THZIcon} alt="user_image" />
                  <span className="notification-text">{notification.from_user}</span>
                  <span>{actionText}</span>
                  <span>{notification.email_content}</span>
                  {/* Add more fields as needed */}
                </div>
              </div>
            )
          })}
       <div className="dropdown-footer">
          <button className="view-notifications" onClick={close}>View all </button>
          <button className="close-notifications-item" onClick={close}><XIcon /> Close</button>
          </div> </div>,
        document.getElementById('portal')
            )}
      <button className="bell"><a href="/collection"><VersionsIcon size={24} /></a></button>
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


  return (
      <div className="App">
        <FrappeProvider url='https://thz.fm'>
          <div className="App-header" style={{ minHeight: '72px' }}>
            <Navbar />
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


