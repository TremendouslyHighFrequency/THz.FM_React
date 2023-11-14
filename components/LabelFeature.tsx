import { Card, Title, Text, Grid, Col } from "@tremor/react";

export default function LabelFeature() {
  return (
<main>
  {/* Full-width Main Feature section */}
  <Grid numItemsLg={1} className="gap-6 my-6">
   
    <Card className="h-60">
      <img src="path-to-your-main-feature-image.jpg" alt="Main Feature" className="h-full w-full object-cover" />
    </Card>
    <Text className="text-lg">A short description of the main feature.</Text>
  </Grid>

  <Text className="text-xl">Genres</Text>
  <Grid numItemsMd={2} className="mt-6 gap-6">
        <Card>
          <div className="h-44" />
        </Card>
        <Card>
          <div className="h-44" />
        </Card>
        <Card>
          <div className="h-44" />
        </Card>
        <Card>
          <div className="h-44" />
        </Card>
        <Card>
          <div className="h-44" />
        </Card>
        <Card>
          <div className="h-44" />
        </Card>
      </Grid>

</main>

  );
}