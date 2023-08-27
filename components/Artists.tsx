import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ArtistItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem } from "@tremor/react";


const Artists = () => {
    const [pageIndex, setPageIndex] = useState<number>(0);
    const { data, error, isValidating } = useFrappeGetDocList<ArtistItem>('Artist', {
        fields: ["title", "artist_bio", "artist_photo"],
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
            <MultiSelect className="w-96">
                <MultiSelectItem value="1">1</MultiSelectItem>
                <MultiSelectItem value="2">2</MultiSelectItem>
                <MultiSelectItem value="3">3</MultiSelectItem>
            </MultiSelect>
                <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
                    {
                        data.map(({ title, artist_bio, artist_photo }, i) => (
                            <Col key={i} numColSpan={1} numColSpanLg={i === 0 ? 2 : 1}>
                                <Card>
                                    <div className="artist-card-bg" style={{ position: 'relative', padding: '16px' }}>
                                        <Text>{title}</Text>
                                        <Link to={`/artists/${title}`}>View Artist</Link>
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

export default Artists;
