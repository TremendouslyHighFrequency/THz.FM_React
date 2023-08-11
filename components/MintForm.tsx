import React, { useState } from 'react';
import { MintNFT } from './MintNFT';
import { Theme, Button, Form } from '@radix-ui/themes'

export const MintForm = () => {  
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [decimals, setDecimals] = useState<string>('0');
  const [uploadComplete, setUploadComplete] = useState(false); // Upload completion state
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadComplete(false); // Reset upload completion state when a new file is selected
    }
  };

  const handleMintClick = async () => {
    if (file) {
      const ipfsLink = await MintNFT(file, title, description, parseInt(decimals), setLoading);
      setUploadComplete(true); // Set upload completion to true when minting ends
      console.log(ipfsLink); // Log the IPFS link
    }
  }; // Added the missing semicolon here

  return (
<>

<div className="">
<h2 className="text-2xl font-bold mb-4">Create your Distinct Digital Master (DDM™)</h2>
      <p className="mb-4">
      Creating a Distinct Digital Master is comparable to producing a master tape recording. 
      It symbolizes the original and authentic version of the highest resolution possible of the digital asset. 
      We recommend generating only a limited number of copies for administrative purposes, as these master Distinct Digital Masters will be utilized to craft lower resolution replicas, Digital Distribution Tokens (DDT™), which will be used for distribution and consumption.
      </p>

      <div className="workflow-section mb-4">
        <h3 className="text-xl mb-2">Workflow:</h3>
        <ol>
          <li>1. Fill in the Title, Description, and Decimals.</li>
          <li>2. Upload the audio file (master recording at the highest bitrate/resolution).</li>
          <li>3. Click "Mint NFT" to create the master NFT.</li>
          <li>4. Use the master NFT to create fungible tokens as needed.</li>
        </ol>
      </div>
</div>
  <div className="mintForm">
      {loading && (
        <div className="loadingOverlay">
          <div className="loadingSpinner">Uploading...</div>
        </div>
      )}
      <div>
        <input className="textInput" type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <input className="textInput" type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <input className="textInput" type="number" placeholder="Decimals" onChange={(e) => setDecimals(e.target.value)} min="0" />
      </div>
      <label><p>(Decimals should almost always be 0 when dealing with NFT masters)</p></label>
      <div>
      <div className="flex justify-center">
        <label className="uploadButton">
          <input type="file" onChange={handleFileChange} accept="audio/*" style={{ display: 'none' }} />
          Upload Audio File
        </label>
        {uploadComplete && ( // Render the "Mint NFT" button only when upload is complete
            <button className="uploadButton" onClick={handleMintClick} disabled={!file}>Mint NFT</button>
          )}
                </div>
      </div>
    </div>
 
    </>
  );
};
