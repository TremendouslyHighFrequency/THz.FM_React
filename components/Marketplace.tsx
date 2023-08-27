import React, { useState, useEffect } from 'react';
import { Grid, Col, Card, Text } from "@tremor/react";
import MeiliSearch from 'meilisearch';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ProductItem } from '../types';
import { Link } from "react-router-dom";

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('merchandise');

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const { data, error: frappeError } = useFrappeGetDocList<ProductItem>('Merchandise', {
    fields: ["title", "image", "price_usd", "price_erg", "owner"],
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    const fetchProductsFromMeili = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });

        if (searchResults.hits.length > 0) {
          setProducts(searchResults.hits);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    if (!useFallback) {
      fetchProductsFromMeili();
    } else if (data && Array.isArray(data)) {
      setProducts(data);
    }

  }, [pageIndex, useFallback, data]);

  if (products.length > 0) {
    return (
      <>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {
            products.map(({ title, image, price_usd, price_erg, owner }, i) => (
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
        {products.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </>
    )
  }

  if (frappeError) {
    return <>{JSON.stringify(frappeError)}</>;
  }

  return <>Loading...</>;
};

export default Marketplace;
