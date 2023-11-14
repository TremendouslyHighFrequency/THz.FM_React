import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { LabelItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem, List, ListItem, SearchSelect } from "@tremor/react";
import MeiliSearch from 'meilisearch';
import LabelFeature from './LabelFeature';

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
      <div className="labelPage grid grid-cols-[minmax(0,1fr),2fr] gap-4">
      <div className="searchColumn p-2 pr-8">
      <h1 className="text-3xl font-bold uppercase">Music Labels & Publishers</h1>
    <Text className="text-lg mb-8">Curators of content collections who strive for their own unique signatures.</Text>
        <MultiSelect className="w-96" placeholder='Search for a label name or genre'>
          <MultiSelectItem value="1">1</MultiSelectItem>
          <MultiSelectItem value="2">2</MultiSelectItem>
          <MultiSelectItem value="3">3</MultiSelectItem>
        </MultiSelect>

        <div className="py-6">
       
        </div>
<Card>
        <List>
          {labels.map(({ title, label_photo }, i) => (
            <ListItem key={i} className="bg-white p-2" style={{ position: 'relative', backgroundImage: `url(${encodeURI(label_photo)})` }}>
             <div className="playButton float-left w-8 block"><img className="w-8" src="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/play-icon.png" />Play</div>
            
                <div className="inline-block px-4">
                <Text className="font-bold text-gray-800">{title}</Text> <Text className="text-xs text-gray-400">Genre 1 •Genre 2 • Genre 3</Text>
                  <Text className="text-xs py-2 text-gray-700">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</Text>
                  <Link className="text-xs text-indigo-400" to={`/label/${title}`}>View Label</Link>
                </div>
                
              
            </ListItem>
          ))}
        </List>

</Card>
        {labels.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </div>

      <div className="labelDisplayColumn flex-grow mr-6">
        <LabelFeature />
    </div>

</div>
    );
  }

  return null;
};

export default Labels;
