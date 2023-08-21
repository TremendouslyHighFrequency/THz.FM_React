import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList, useFrappeFileUpload } from 'frappe-react-sdk';
import { getLoggedUser } from './api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CreateRelease = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [labels, setLabels] = useState([]);
  const [artists, setArtists] = useState([]);
  const [releaseTypes, setReleaseTypes] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [releaseGenres, setReleaseGenres] = useState([]); // State variable for 'Release Genres'
  const [credits, setCredits] = useState([]); // State variable for 'Release Credits'
  const [selectedCredits, setSelectedCredits] = useState({});
  const [genreInput, setGenreInput] = useState(''); // What user types
  const [filteredGenres, setFilteredGenres] = useState([]); // Filtered results based on input
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  // Fetch the logged-in user
  useEffect(() => {
    getLoggedUser().then(user => setLoggedUser(user));
  }, []);

  // Fetch labels owned by the logged-in user
  const { data: userLabels, error } = useFrappeGetDocList('Label', {
    fields: ["title"],
    filters: loggedUser ? { "owner": loggedUser } : null, // Filter by the owner
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  // Fetch artists owned by the logged-in user
const { data: userArtists, error: artistError } = useFrappeGetDocList('Artist', {
  fields: ["name"],  // assuming 'name' is a field in the 'Artist' doctype
  filters: loggedUser ? { "owner": loggedUser } : null, 
  limit: 50,
  orderBy: {
    field: "creation",
    order: 'desc'
  }
});

// Fetch release types
const { data: userReleaseTypes, error: releaseTypeError } = useFrappeGetDocList('Release Type', {
  fields: ["name"],  // assuming 'type' is a field in the 'ReleaseType' doctype
  limit: 50,
  orderBy: {
    field: "creation",
    order: 'desc'
  }
});
const handleSubmit = (e) => {
  e.preventDefault();

  const formattedTracks = tracks.map(track => ({
    track_number: track.track_number,
    track_title: track.title,
    track_artist: track.track_artist,
    track_type: track.track_type,
    attach_wav: track.attach_wav,  // This may need further processing if you want to upload the file to Frappe
    price_usd: parseFloat(track.price_usd),
    price_erg: parseFloat(track.price_erg),
    published: track.published,
    // Add other fields as necessary
    doctype: "Track"
  }));

  const releaseData = {
    title: document.getElementById('title').value,
    release_id: document.getElementById('release_id').value,
    release_artist: document.getElementById('release_artist').value,
    release_label: document.getElementById('release_label').value,
    release_type: document.getElementById('release_type').value,
    release_artwork: document.getElementById('release_artwork').files[0], // Assuming it's a file input
    release_description: document.getElementById('release_description').value,
    release_date: document.getElementById('release_date').value,
    price_usd: parseFloat(document.getElementById('price_usd').value),
    price_erg: parseFloat(document.getElementById('price_erg').value),
    release_ergo_address: document.getElementById('release_ergo_address').value,
    release_tracks: formattedTracks
  };

    // Using the fetch API instead of the hook
    fetch(`https://thz.fm/api/resource/Release`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(releaseData),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Successfully created release:", data);
      navigate('/manage-releases');
      // Consider resetting your component state here or redirecting the user
    })
    .catch(error => {
      console.error("Error creating release:", error);
      setFetchError(error.message);
    });
  };

useEffect(() => {
  if (userArtists) {
    setArtists(userArtists.map(artist => artist.name));
  } else if (artistError) {
    setFetchError(artistError);
  }

  if (userReleaseTypes) {
    setReleaseTypes(userReleaseTypes.map(releaseType => releaseType.name));
  } else if (releaseTypeError) {
    setFetchError(releaseTypeError);
  }
}, [userArtists, artistError, userReleaseTypes, releaseTypeError]);
  
  // Then, within your useEffect for fetching labels:
  useEffect(() => {
      if (userLabels) {
        setLabels(userLabels.map(label => label.title));
        setIsLoading(false);
      } else if (error) {
        setFetchError(error);
        setIsLoading(false);
      }
  }, [userLabels, error]);

   // Fetch 'Release Genres' from Frappe
   const { data: fetchedReleaseGenres, error: releaseGenreError } = useFrappeGetDocList('Genre List', {
    fields: ["name"],
    limit: 0,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    if (fetchedReleaseGenres) {
      setReleaseGenres(fetchedReleaseGenres.map(rg => rg.name));
    } else if (releaseGenreError) {
      setFetchError(releaseGenreError);
    }
  }, [fetchedReleaseGenres, releaseGenreError]);

  useEffect(() => {
    if (genreInput) {
      const lowerCaseInput = genreInput.toLowerCase();
      const filtered = releaseGenres.filter(genre =>
        genre.toLowerCase().includes(lowerCaseInput) && !selectedGenres.includes(genre)
      );
      setFilteredGenres(filtered);
    } else {
      setFilteredGenres([]);
    }
  }, [genreInput, releaseGenres, selectedGenres]);

  const addCredit = () => {
    const newCredit = {
      name__title: '', // Default value for the credit's name
      credit_type: '', // Default value for the credit type
      track_if_applicable: '' // Default value for the credited track
      // ... add other default values for credit properties as necessary ...
    };
    setCredits([...credits, newCredit]);
  };
  
  const handleCreditSelection = (idx, isChecked) => {
    setSelectedCredits(prevState => ({ ...prevState, [idx]: isChecked }));
  };
  
  const deleteSelectedCredits = () => {
    setCredits(credits.filter((_, idx) => !selectedCredits[idx]));
    setSelectedCredits({}); // Reset selected credits
  };

  const addTrack = () => {
    // Adding a track object with auto-incremented track_number to the tracks array
    const newTrack = { track_number: tracks.length + 1 };
    setTracks([...tracks, newTrack]);
};

const handleTrackSelection = (idx, isChecked) => {
  setSelectedTracks(prevState => ({ ...prevState, [idx]: isChecked }));
};

const deleteSelectedTracks = () => {
  setTracks(tracks.filter((_, idx) => !selectedTracks[idx]));
  setSelectedTracks({}); // Reset selected tracks
};
const [formStructure, setFormStructure] = useState(null); // To store the fetched form structure

useEffect(() => {
  async function fetchFormStructure() {
    // Assuming you have multiple URLs to fetch form fields from
    const urls = [
      'https://thz.fm/api/resource/Web%20Form/create-release',
      // ... other URLs
    ];

    try {
      // Make parallel requests to all URLs
      const responses = await Promise.all(urls.map(url => axios.get(url)));

      // Combine the results from all requests
      const combinedFields = responses.flatMap(response => response.data.data.web_form_fields);

      setFormStructure(combinedFields);
    } catch (error) {
      console.error("Error fetching the form structure:", error);
      setFetchError(error.message);
    }
  }

  fetchFormStructure();
}, []);

const renderFieldsFromStructure = () => {
  if (!formStructure || !Array.isArray(formStructure)) return null;

  return formStructure.map((field) => {
    // For debugging, let's print all fields to see the structure
    console.log(field);

    if (field.fieldtype === 'Data') {
      return (
        <div key={field.name}>
          <label className="text-gray-700" htmlFor={field.fieldname}>{field.label}</label>
          <input id={field.fieldname} type="text" className="block w-full px-4 py-2 mt-2" />
        </div>
      );
    }
    return null; // for unhandled field types
  });
};



return (
  <div className="releaseForm">
    <form>
      <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
        {/* Dynamic fields */}
        {renderFieldsFromStructure()}

        {/* You can keep the parts that are not dynamic as they are */}
      </div>

      {/* ... Rest of your form ... */}
    </form>
  </div>
);
};

export default CreateRelease;