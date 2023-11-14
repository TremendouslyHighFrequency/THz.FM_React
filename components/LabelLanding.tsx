import { Card, Title, Text, Grid, Col } from "@tremor/react";

export default function LabelFeature() {
  return (
<main>
  {/* Full-width Main Feature section */}
  <Grid numItemsLg={1} className="gap-6 mt-6">
    <h1 className="text-3xl font-bold uppercase">Label Name</h1>
    <Text className="text-lg">View Full Label Page</Text>
    <Card className="h-60">
      <img src="path-to-your-main-feature-image.jpg" alt="Main Feature" className="h-full w-full object-cover" />
    </Card>
  </Grid>

  {/* Row of cards */}
  <h1 className="text-1xl mt-6 font-bold uppercase">Music</h1>
  <Grid numItemsLg={4} className="gap-6">
    {/* Cards will be in a row for larger screens and wrap into multiple rows as needed */}
    {/* Generate each Card with a loop or manually */}
    <Card className="h-44">
      {/* Content */}
    </Card>
    <Card className="h-44">
      {/* Content */}
    </Card>
    <Card className="h-44">
      {/* Content */}
    </Card>
    <Card className="h-44">
      {/* Content */}
    </Card>
    {/* ... other cards */}
  </Grid>

  {/* Another row of cards for additional content, if needed */}
  <h1 className="text-1xl font-bold uppercase  mt-6">Events</h1>
  <Grid numItemsLg={4} className="gap-6">
    <Card className="h-44">
      {/* Content */}
    </Card>
    {/* ... other cards */}
  </Grid>
</main>

  );
}