import React, { useState } from 'react';
import { ProgressBar } from "@tremor/react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { MintNFT } from './MintNFT';
import './component_styles/Checkbox.css';

export const MintForm = () => {  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [decimals, setDecimals] = useState<string>('0');
  const [uploadComplete, setUploadComplete] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showNautilus, setShowNautilus] = useState(false);
  const [nftStorageProgress, setNftStorageProgress] = useState<number | null>(null);
  const [showDecimals, setShowDecimals] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(0);
  const [primaryArtist, setPrimaryArtist] = useState<string>('');
  const [albumArt, setAlbumArt] = useState<File | null>(null);
  const [otherArtists, setOtherArtists] = useState<string[]>([]);
  const [showMultipleArtists, setShowMultipleArtists] = useState(false);


  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File change event triggered.");
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log(`Selected file: ${e.target.files[0].name}`);
      
      setLoading(true);
      setUploadProgress(0);
      setTimeout(() => setUploadProgress(50), 1000); 
      setTimeout(() => {
        setUploadProgress(100);
        setLoading(false);
      }, 2000);
      
      setUploadComplete(true);
    } else {
      console.log("No file selected or multiple files selected.");
      setUploadComplete(false);
    }
  };

  const handleAlbumArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setAlbumArt(e.target.files[0]);
    }
};

const handleAddArtist = () => {
    setOtherArtists([...otherArtists, '']);
};

const handleRemoveArtist = (index: number) => {
    const newArtists = [...otherArtists];
    newArtists.splice(index, 1);
    setOtherArtists(newArtists);
};

const handleArtistChange = (index: number, value: string) => {
    const newArtists = [...otherArtists];
    newArtists[index] = value;
    setOtherArtists(newArtists);
};

  const handleMintClick = async () => {
    const description = JSON.stringify({
      mainRep: primaryArtist,
      otherReps: otherArtists.join(';')
  });
    setLoading(false);
    setShowNautilus(true);
    console.log("Create button clicked.");
    if (file) {
      console.log("Creating DDM...");
      try {
        const ipfsLink = await MintNFT(file, title, description, parseInt(decimals), setLoading, setNftStorageProgress);
        setUploadComplete(true); 
        console.log(`Creation completed. IPFS link: ${ipfsLink}`);
      } catch (error) {
        console.error("Error during creation:", error);
      }
    } else {
      console.log("No file available for DDM creation.");
    }
    setShowNautilus(false);
  };

  const handleCheckboxToggle = () => {
    setCheckboxValue(prevValue => {
      const newValue = (prevValue === 0 ? 1 : 0);
      setShowDecimals(newValue === 1);
      // If subunits are selected, set the decimals field to a minimum of 1
      if (newValue === 1) {
        setDecimals('1');
      }
      return newValue;
    });
  };
  


return (
  <>
    <div className="mb-4 bg-white rounded-lg shadow-md p-12">
      <h2 className="text-2xl font-bold mb-4">Create your Distinct Digital Master (DDM™)</h2>
      <p className="mb-4">
        Creating a Distinct Digital Master is comparable to producing a master tape recording.<br />
        It symbolizes the original and authentic version of the highest resolution possible of the digital asset.<br /><br />
        A DDM can be created anonymously, tied to an artist psuedonym, or with fully identifiable information.<br />
        One proposed workflow would be for the mastering studio / mixing agent to produce the DDM for their clients as a service.<br /><br />
        The goal of the DDM process is to create a proof of ownership of a digital good which is formatted specifically to be utilized in modular contract systems.<br />
        The DDM is a unique digital asset which can be used to create a Decentralized Release Contract which can be used to manage rights, royalties and payouts.<br />
        <br />
      </p>

<div className="">
<div className="workflow-section mb-4">
    <h3 className="text-xl mb-6">Workflow:</h3>
    <ol>
        <li className="mb-2">1. Fill in the Title of the master. Only include the title and no other information.<br /><span className="text-xs">*Hint: this would be a song name, or the name of a painting.</span></li>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700 bg-indigo-50 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />

        <li className="mb-2">2. Is this a solo work, or will there be multiple artists/representatives of the work?</li>
        <div className="flex items-center mt-4">
            <div 
                className="CheckboxRoot mr-2" 
                onClick={() => setShowMultipleArtists(!showMultipleArtists)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {showMultipleArtists && <CheckIcon />}
            </div>
            <label className="text-gray-700 text-sm font-bold">
                Multiple artists/representatives
            </label>
        </div>
        <p className="text-gray-700 mt-2 text-xs">
            If this is a solo work, leave unchecked. If there will be multiple artists or representatives for the work, check this option and fill in the details below.
        </p>

      {showMultipleArtists && (
                    <>
                        <li className="mb-2">Primary Artist or Representative:</li>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 bg-indigo-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="representative" type="text" placeholder="Primary artist or representative" onChange={(e) => setPrimaryArtist(e.target.value)} />
                        
                        {otherArtists.map((artist, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 bg-indigo-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={artist} onChange={e => handleArtistChange(index, e.target.value)} placeholder={`Artist ${index + 2}`} />
                                <button onClick={() => handleRemoveArtist(index)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded">Remove</button>
                            </div>
                        ))}
                        <button onClick={handleAddArtist} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add another artist</button>
                    </>
                )}

<li className="mb-2 mt-6">3. Upload the album art:</li>
                <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
                    <input type="file" onChange={handleAlbumArtChange} accept="image/*" style={{ display: 'none' }} />
                    Upload Album Art
                </label>

         
        </ol>
      </div>
      
    </div>

    <div className="mb-4 mt-12">

      {loading && !showNautilus && uploadProgress !== null && (
        <div className="loading-modal mb-4">
          <img className="thzIcon-logo w-32 mb-4" src="https://thz.fm/files/Terahertz-app-icon3da4a5.png" alt="THz Logo" />
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <span className="text-black mb-2">Waiting for file upload to complete...</span>
            {/* Using the ProgressBar component */}
            <ProgressBar value={uploadProgress} className="mt-2" />
          </div>
        </div>
      )}

    
      <div className="flex items-center mt-4">
        <div 
          className="CheckboxRoot mr-2" 
          onClick={handleCheckboxToggle}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {checkboxValue === 1 && <CheckIcon />}
        </div>
        <label className="text-gray-700 text-sm font-bold" htmlFor="showDecimalsCheckbox">
          Do you intend to break down the DDM into subunits?
        </label>
      </div>
      <p className="text-gray-700 mt-1 text-xs">
        Selecting this option allows you to divide the DDM into subunits, which can be useful for situations like shared rights or collaborations where each person wants an actual share of the DDM or the decision making process.
      </p>

      {showDecimals && (
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="decimals">
          Decimals represent how the DDM can be divided. 
         <span className="font-normal">
          <br />A value of 0 means the DDM cannot be split (1).
          <br />A value of 1 means the DDM can be split into 10 parts (0.1,0.2,...,1.0).
          <br />A value of 2 means the DDM can be split into 100 parts (0.01,0.02,...,1.00).
          <br />A value of 3 means the DDM can be split into 1000 parts (0.001,0.002,...,1.000).
          </span>
          </label>
          <input
  className="shadow appearance-none border rounded w-full py-2 px-3 bg-indigo-50 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  id="decimals"
  type="number"
  placeholder="Decimals (Decimal Places)"
  onChange={(e) => setDecimals(e.target.value)}
  min={showDecimals ? "1" : "0"}  // Dynamic min value based on showDecimals state
  required={showDecimals}        // Required if subunits are selected
/>

          <p className="text-gray-700 mt-1"></p>
        </div> 
      )}

      <div className="flex mt-8">
        <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer">
          <input type="file" onChange={handleFileChange} accept="audio/*" style={{ display: 'none' }} />
          Upload Audio File
        </label>

        {uploadComplete && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2" onClick={handleMintClick} disabled={!file}>
            Create DDM™
          </button>
        )}

        {showNautilus && (
          <div className="loading-modal mt-4">
            <img className="thzIcon-logo w-32 mb-4" src="https://thz.fm/files/Terahertz-app-icon3da4a5.png" alt="THz Logo" />
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <span className="text-black mb-2">Magic machine elves are currently processing your audio...</span>
              <ProgressBar value={nftStorageProgress} className="mt-2" />
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  </>
);
};