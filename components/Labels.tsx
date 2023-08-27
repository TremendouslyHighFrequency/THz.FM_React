import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { LabelItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem } from "@tremor/react";
import MeiliSearch from 'meilisearch';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('labels');

const Labels = () => {
  const [labels, setLabels] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const { data, error: frappeError } = useFrappeGetDocList<LabelItem>('Label', {
    fields: ["title", "label_photo"],
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });
        if (searchResults.hits.length > 0) {
          setLabels(searchResults.hits);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    if (!useFallback) {
      fetchLabels();
    } else if (data && Array.isArray(data)) {
      setLabels(data);
    }
  }, [pageIndex, useFallback, data]);

  if (frappeError) {
    return <>{JSON.stringify(frappeError)}</>;
  }

  if (labels.length > 0) {
    return (
      <div>
        <MultiSelect className="w-96">
          <MultiSelectItem value="1">1</MultiSelectItem>
          <MultiSelectItem value="2">2</MultiSelectItem>
          <MultiSelectItem value="3">3</MultiSelectItem>
        </MultiSelect>

        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {labels.map(({ title, label_photo }, i) => (
            <Col key={i}>
              <Card>
                <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${encodeURI(label_photo)})` }}>
                  <Text>{title}</Text>
                  <Link to={`/label/${title}`}>View Label</Link>
                </div>
              </Card>
            </Col>
          ))}
        </Grid>
        {labels.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </div>
    );
  }

  return null;
};

export default Labels;
