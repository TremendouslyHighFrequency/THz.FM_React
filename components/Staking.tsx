import { Card, Metric, Text, AreaChart, Tab, TabList, Grid, TabGroup } from "@tremor/react";

import { useState } from "react";

const sales = [
  {
    Month: "Jan 21",
    "This year": 2890,
    "Last year": 2190,
    Peer: 1930,
  },
  {
    Month: "Feb 21",
    "This year": 1890,
    "Last year": 2230,
    Peer: 1600,
  },
  // ...
  {
    Month: "Jul 21",
    "This year": 3490,
    "Last year": 2187,
    Peer: 3200,
  },
];

const profit = [
  {
    Month: "Jan 21",
    "This year": 2400,
    "Last year": 2650,
    Peer: 2100,
  },
  {
    Month: "Feb 21",
    "This year": 1990,
    "Last year": 2300,
    Peer: 1450,
  },
  // ...
  {
    Month: "Jul 21",
    "This year": 4300,
    "Last year": 3850,
    Peer: 3100,
  },
];

const customers = [
  {
    Month: "Jan 21",
    "This year": 4300,
    "Last year": 1505,
    Peer: 3010,
  },
  {
    Month: "Feb 21",
    "This year": 4380,
    "Last year": 1960,
    Peer: 2800,
  },
  // ...
  {
    Month: "Jul 21",
    "This year": 3290,
    "Last year": 3150,
    Peer: 2100,
  },
];

const valueFormatterNumber = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

const valueFormatterCurrency = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

const categories = [
  {
    title: "Sales • YTD",
    metric: "$ 12,699",
    data: sales,
    valueFormatter: valueFormatterCurrency,
  },
  {
    title: "Profit • YTD",
    metric: "$ 12,348",
    data: profit,
    valueFormatter: valueFormatterCurrency,
  },
  {
    title: "Customers • YTD",
    metric: "948",
    data: customers,
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