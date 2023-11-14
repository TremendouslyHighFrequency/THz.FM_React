    
    export default function ReleaseDetail() {
      return (
    <div>
        {/* Display the data */}
        
        <div className="album-page">   
          <div className="album-info">
            {/* Text and Details Container */}
            <div className="album-text-info">
              <div className="h1 mb-2">{data.title}</div>
              <p className="mb-4"><Link to={`/search/type/${data.release_type}`}>{data.release_type}</Link> by: <Link to={`/artists/${data.release_artist}`}>{data.release_artist}</Link></p>
              <div className="mb-12">
                {Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                  <Link to={`/search/genre/${genre.genre}`}><p className="genre-item" key={index}>{genre.genre}</p></Link>
                ))}
              </div>
              
              <p className="mb-12 text-lg">{data.release_description}</p>
              <Link to={`/releases/${data.title}/by/${data.release_artist}/${data.name}/listening-party`}>Join Listening Party</Link>
              <FooterPlayer track={currentTrack} playing={playingTrackIndex !== null} onPlay={onPlay} onPrev={onPrev} onNext={onNext} progressPercentage={progressPercentage} />
              <div className="mt-8">
                 
              <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet mr-12">Purchase</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Choose payment method</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          This artist accepts both ERG and USD.<br />        
          <span className="text-xs">(ERG payment requires Nautilus wallet connection.)</span>
        </Dialog.Description>
 
          <div className="flex space-x-4">
          {
    !showPayPalButtons && (
        <>
          <button className="Button orange w-full text-lg" onClick={handleButtonClick} style={{ fontFamily: "'Russo One', sans-serif" }}><span><b>∑ </b>{data.price_erg} ERG</span></button>
          <button className="Button green w-full text-lg" onClick={() => setShowPayPalButtons(true)} style={{ fontFamily: "'Russo One', sans-serif" }}><span>${data.price_usd} USD</span></button>
          </>
    )
}

{showPayPalButtons && data.price_usd && (
   <>
  <PayPalButtons
    price_usd={data.price_usd}
    createOrder={async (orderData, actions) => {
      const amount_usd = data.price_usd; // Access price_usd from component's props
      try {
        const response = await fetch(`https://thz.fm/api/method/frappe.create_order.create_paypal_order?amount_usd=${amount_usd}`);
        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (responseData.message && responseData.message.orderID) {
          return responseData.message.orderID; // Return the nested order ID
        } else {
          const errorMsg = responseData.error ? responseData.error : 'Failed to create PayPal order';
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error("Error creating PayPal order:", error);
        throw error; // Rethrow the error to propagate it
      }
    }}
    onApprove={async (data, actions) => {
      console.log("onApprove Data:", data);
      try {
        const orderID = data.orderID;
        console.log("Received orderID:", orderID);
        
        // Make a POST call to capture the PayPal order
        const response = await fetch(`https://thz.fm/api/method/frappe.create_order.capture_paypal_order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderID })
        });
        const captureResponse = await response.json();

        if (captureResponse && !captureResponse.error) {
          setMessage(`Payment captured successfully!`);
        } else {
          throw new Error(captureResponse.error || 'Failed to capture payment.');
        }

      } catch (error) {
        console.error("Error capturing PayPal order:", error);
        setMessage('Failed to capture payment.');
      }
    }}
  />
  <button 
                className="Button gray w-full text-lg" 
                onClick={() => setShowPayPalButtons(false)} 
                style={{ fontFamily: "'Russo One', sans-serif", marginLeft: '10px' }}>
                    <span>Back</span>
            </button>
             </>
)}
          
      
          </div>

        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  
  <ShareModal data={data} />
          <button onClick={() => handleFavoriteClick("release", data)} className="Button gray ml-12">Add to Favorites</button>
          
              
                
              </div>
            
            </div>

            {/* Album Artwork */}
            <div className="display-artwork" style={{backgroundImage: `url(${data.release_artwork})`}}></div>
          </div>
          
          <div className="tracklist-container">
              {Array.isArray(data.release_tracks) && data.release_tracks.map((track, index) => (
                <Track 
                track={track} 
                index={index} 
                key={`${name}-${index}`}
                containerColor={data.container_color} 
                waveformColor={data.waveform_color}  
                releasetextColor={data.release_text_color}
                tracktextColor={data.track_text_color}
                progressColor={data.progress_color}
                playing={index === playingTrackIndex}
                onPlay={() => setPlayingTrackIndex(index)}
                onNext={onNext}
                onPrev={onPrev}
                setCurrentTime={setCurrentTime}
                setDuration={setDuration}
                handleFavoriteClick={handleFavoriteClick}
                loading={loading}
                setLoading={setLoading}
                />
              ))}
              </div>
          </div>
          <div className="flex space-x-8 mt-24">
          
              <div className="credits ml-12 mt-12">
                <p>Released On: {data.release_date}</p>
                <p>Publisher: <Link to={`/labels/${data.release_label}`}>{data.release_label}</Link></p>
                <p>Credits:</p>
                {Array.isArray(data.release_credits) && data.release_credits.map((credit, index) => (
                  <p key={index}>{credit.credit_type}: {credit.name__title}</p>
                ))}
              </div>       
              <div className="ml-24 metadata mt-12">
                <p>ISRC: {data.isrc}</p>
                <p>UPC: {data.upc}</p>
                <p>Release ID: {data.release_id}</p>
                <p>Contract Addr: </p>
              </div>
             </div>

     { showLoading && (
 <div className="loading-modal">

 <img className="nautilus-logo w-32 mb-4" src="https://thz.fm/files/m-512.png" alt="Nautilus Logo"/>
 
 <span className="p-24 bg-white rounded-lg shadow-lg text-black">Waiting for Nautilus wallet...</span>
</div>
)}        

     
      </div>

);
}



