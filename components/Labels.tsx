import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { LabelItem } from '../types';
import { Link } from "react-router-dom";

const Labels = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<LabelItem>('Label' , {
      fields: ["title","label_photo"],
      limit_start: pageIndex,
      limit: 50,
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
                      data.map(({title, label_photo}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(http://thz.fm${label_photo})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <Link to={`/label/${title}`}>View Label</Link>
                              </div>
                          </div>
  
                      ))
                  }
                  <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
          </div>
      )
  }
  return null
};

export default Labels;
