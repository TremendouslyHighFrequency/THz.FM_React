import {
    Card,
    Title,
    Bold,
    Text,
    List,
    ListItem,
    Tab,
    TabList,
    TabGroup,
    Grid,
  } from "@tremor/react";
  
  import React, { useState } from "react";
  
  const Categories = {
    Interested: "interested",
    Open: "open",
    Reply: "reply",
  };
  
  const genres = [
    {
      name: "Pop",
      data: {
        [Categories.Interested]: { amount: "5,000", share: "25%" },
        [Categories.Open]: { amount: "4,500", share: "22.5%" },
        [Categories.Reply]: { amount: "3,800", share: "19%" },
      },
    },
    {
      name: "Rock",
      data: {
        [Categories.Interested]: { amount: "4,200", share: "21%" },
        [Categories.Open]: { amount: "3,900", share: "19.5%" },
        [Categories.Reply]: { amount: "3,400", share: "17%" },
      },
    },
    // ... (more genres)
  ];
  
  const regions = [
    {
      name: "North America",
      data: {
        [Categories.Interested]: { amount: "6,000", share: "30%" },
        [Categories.Open]: { amount: "5,200", share: "26%" },
        [Categories.Reply]: { amount: "4,500", share: "22.5%" },
      },
    },
    // ... (more regions)
  ];
  
  const ageGroups = [
    {
      name: "18-24",
      data: {
        [Categories.Interested]: { amount: "2,500", share: "12.5%" },
        [Categories.Open]: { amount: "2,200", share: "11%" },
        [Categories.Reply]: { amount: "1,900", share: "9.5%" },
      },
    },
    // ... (more age groups)
  ];
  
  const platforms = [
    {
      name: "Spotify",
      data: {
        [Categories.Interested]: { amount: "7,000", share: "35%" },
        [Categories.Open]: { amount: "6,300", share: "31.5%" },
        [Categories.Reply]: { amount: "5,500", share: "27.5%" },
      },
    },
    // ... (more platforms)
  ];
  
  const categoriesList = Object.values(Categories);
  
  export default function ReleaseMetrics() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedCategory = categoriesList[selectedIndex];
  
    return (
      <Card>
        <Title>Most Engaged Audience</Title>
        <Grid numItemsMd={2} className="gap-x-8 gap-y-2">
          <div>
            <Title className="mt-8">Genres</Title>
            <List className="mt-2">
              {genres.map((item) => (
                <ListItem key={item.name}>
                  <Text>{item.name}</Text>
                  <Text>
                    <Bold>{item.data[selectedCategory].amount}</Bold>{" "}
                    {`(${item.data[selectedCategory].share})`}
                  </Text>
                </ListItem>
              ))}
            </List>
          </div>
          <div>
            <Title className="mt-8">Regions</Title>
            <List className="mt-2">
              {regions.map((item) => (
                <ListItem key={item.name}>
                  <Text>{item.name}</Text>
                  <Text>
                    <Bold>{item.data[selectedCategory].amount}</Bold>{" "}
                    {`(${item.data[selectedCategory].share})`}
                  </Text>
                </ListItem>
              ))}
            </List>
          </div>
          <div>
            <Title className="mt-8">Age Groups</Title>
            <List className="mt-2">
              {ageGroups.map((item) => (
                <ListItem key={item.name}>
                  <Text>{item.name}</Text>
                  <Text>
                    <Bold>{item.data[selectedCategory].amount}</Bold>{" "}
                    {`(${item.data[selectedCategory].share})`}
                  </Text>
                </ListItem>
              ))}
            </List>
          </div>
          <div>
            <Title className="mt-8">Listening Platforms</Title>
            <List className="mt-2">
              {platforms.map((item) => (
                <ListItem key={item.name}>
                  <Text>{item.name}</Text>
                  <Text>
                    <Bold>{item.data[selectedCategory].amount}</Bold>{" "}
                    {`(${item.data[selectedCategory].share})`}
                  </Text>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Card>
    );
  }
  