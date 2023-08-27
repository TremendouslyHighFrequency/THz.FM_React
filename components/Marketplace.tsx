import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ProductItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text } from "@tremor/react";

const Marketplace = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { data, error, isValidating } = useFrappeGetDocList<ProductItem>('Merchandise', {
    fields: ["title", "image", "price_usd", "price_erg", "owner"],
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
      <>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {
            data.map(({ title, image, price_usd, price_erg, owner }, i) => (
              <Col key={i}>
                <Card>
                  <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${image})` }}>
                    <Text>{title}</Text>
                    <p>{price_usd} USD</p>
                    <p>{price_erg} ERG</p>
                    <Link to={`/marketplace/${owner}/product/${title}`}>View Product</Link>
                  </div>
                </Card>
              </Col>
            ))
          }
        </Grid>
        {data.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </>
    )
  }
  return null;
};

export default Marketplace;
