import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk';
import { LabelItem } from '../types'; // Ensure this type definition matches your data structure
import LabelFeature from './LabelFeature';

const Label = () => {
  const { name } = useParams(); 
  const { data, error, isValidating } = useFrappeGetDoc<LabelItem>('Label', name);  
  const [label, setLabel] = useState<LabelItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<any>(null); // Correctly define error state

  useEffect(() => {
    if (data) {
      setLabel(data);
      setLoading(false);
    } else if (error) {
      setLocalError(error);
      setLoading(false);
    }
  }, [data, error]);

  if (loading) return <div>Loading...</div>;
  if (localError) return <div>Error: {localError.message}</div>; // Display localError

  if (label) {
    return (
      <div>
        <h1>{label.name}</h1> {/* Ensure properties match the LabelItem type */}
        {/* Render other label details here */}
      </div>
    );
  }

  return null;
};

export default Label;
