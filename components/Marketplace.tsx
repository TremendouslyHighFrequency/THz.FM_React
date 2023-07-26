import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ProductItem } from '../types';
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<ProductItem>('Merchandise' , {
      fields: ["title", "image", "price_usd", "price_erg", "owner"],
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
                      data.map(({title, image, price_usd, price_erg, owner}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <p>{price_usd}</p>
                                  <p>{price_erg}</p>
                                  <Link to={`/marketplace/${owner}/product/${title}`}>View Prodct</Link>
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

export default Marketplace;
