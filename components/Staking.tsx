import { Card, Metric, Text, AreaChart, Tab, TabList, Grid, TabGroup } from "@tremor/react";

import { useState } from "react";

const totalStaked = [
    {
      Month: "Jan 21",
      "THz": 25000,
      "SigUSD": 30000,
      Peer: 20000,
    },
    {
      Month: "Feb 21",
      "THz": 27000,
      "SigUSD": 32000,
      Peer: 21000,
    },
    // ...
    {
      Month: "Jul 21",
      "THz": 35000,
      "SigUSD": 38000,
      Peer: 30000,
    },
  ];
  
  const rewardsEarned = [
    {
      Month: "Jan 21",
      "THz": 50,
      "SigUSD": 45,
      Peer: 40,
    },
    {
      Month: "Feb 21",
      "THz": 55,
      "SigUSD": 50,
      Peer: 45,
    },
    // ...
    {
      Month: "Jul 21",
      "THz": 60,
      "SigUSD": 55,
      Peer: 50,
    },
  ];
  
  const stakersCount = [
    {
      Month: "Jan 21",
      "THz": 200,
      "SigUSD": 180,
      Peer: 170,
    },
    {
      Month: "Feb 21",
      "THz": 220,
      "SigUSD": 210,
      Peer: 190,
    },
    // ...
    {
      Month: "Jul 21",
      "THz": 240,
      "SigUSD": 230,
      Peer: 220,
    },
  ];
  
  const categories = [
    {
      title: "Total Staked • YTD",
      metric: "58,000 THz",
      data: totalStaked,
      valueFormatter: valueFormatterNumber,
    },
    {
      title: "Rewards Earned • YTD",
      metric: "165 THz",
      data: rewardsEarned,
      valueFormatter: valueFormatterNumber,
    },
    {
      title: "Stakers Count • YTD",
      metric: "470",
      data: stakersCount,
      valueFormatter: valueFormatterNumber,
    },
  ];

const LineChartView = ({ category }: { category: any }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <TabGroup className="mt-6" index={selectedIndex} onIndexChange={(i) => setSelectedIndex(i)}>
        <TabList>
          <Tab>Peer group</Tab>
          <Tab>Same period last year</Tab>
        </TabList>
      </TabGroup>
      <AreaChart
        className="h-40 mt-4"
        data={category.data}
        index="Month"
        categories={["This year", selectedIndex == 0 ? "Peer" : "Last year"]}
        colors={["blue", "slate"]}
        valueFormatter={category.valueFormatter}
        showXAxis={true}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
      />
    </>
  );
};

export default function StakingMetrics() {
  return (
    <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title}>
          <Text>{item.title}</Text>
          <Metric>{item.metric}</Metric>
          <LineChartView category={item} />
        </Card>
      ))}
    </Grid>
  );
}