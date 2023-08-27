import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { LabelItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem } from "@tremor/react";

const Labels = () => {
    const [pageIndex, setPageIndex] = useState<number>(0);
    const { data, error, isValidating } = useFrappeGetDocList<LabelItem>('Label', {
        fields: ["title", "label_photo"],
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
            <div>
                <MultiSelect className="w-96">
                    <MultiSelectItem value="1">1</MultiSelectItem>
                    <MultiSelectItem value="2">2</MultiSelectItem>
                    <MultiSelectItem value="3">3</MultiSelectItem>
                </MultiSelect>

                <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
                    {
                        data.map(({ title, label_photo }, i) => (
                            <Col key={i}>
                                <Card>
                                    <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${encodeURI(label_photo)})` }}>
                                        <Text>{title}</Text>
                                        <Link to={`/label/${title}`}>View Label</Link>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    }
                </Grid>
                {data.length >= 50 && (
                    <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
                )}
            </div>
        )
    }
    return null;
};

export default Labels;
