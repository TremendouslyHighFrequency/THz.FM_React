import React, { useEffect, useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types'; // Define the ReleaseItem type according to the Release document structure
import { Link } from "react-router-dom";
import { getLoggedUser } from './components/api'; // Update with the correct path

const CreateRelease = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    getLoggedUser()
      .then((user) => setLoggedUser(user))
      .catch((error) => console.error(error));
  }, []);

  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release', {
    fields: ["title", "release_artist","release_artwork", "name"], // Update the fields as per the 'Release' document structure
    filters: loggedUser ? { "owner": loggedUser } : {},
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  if (isValidating) {
    return <>Loading</>;
  }
  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  if (data && Array.isArray(data)) {
    return (
      <div className="releases-index">
        {
          data.map(({ title, release_photo, name }, i) => (
            <div key={i} className="release-card" style={{ backgroundImage: `url(${encodeURI(release_photo)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="release-text">
                <h4>{title}</h4>
                <Link to={`/edit/${loggedUser}/${title}/${name}`}>Manage Release</Link>
              </div>
            </div>
          ))
        }
        <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
      </div>
    );
  }
  return null;
};

export default CreateRelease;
