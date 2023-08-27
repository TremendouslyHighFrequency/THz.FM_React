import {
    Card,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableBody,
    BadgeDelta,
    DeltaType,
    MultiSelect,
    MultiSelectItem,
  } from "@tremor/react";
  import { useState } from "react";
  
  type MusicCampaign = {
    labelName: string;
    campaignsRun: number;
    topPromotedTrack: string;
    trackRating: string;
    listenersReached: number;
    campaignBudget: string;
    campaignEffectiveness: string; // could be 'high', 'medium', 'low'
    deltaType: DeltaType;
  };
  
  const musicCampaigns: MusicCampaign[] = [
    {
      labelName: "Alpha Records",
      campaignsRun: 5,
      topPromotedTrack: "Echoes of Silence",
      trackRating: "4.8",
      listenersReached: 500000,
      campaignBudget: "$200,000",
      campaignEffectiveness: "high",
      deltaType: "increase",
    },
    {
      labelName: "Beta Sounds",
      campaignsRun: 3,
      topPromotedTrack: "Moonlight Serenade",
      trackRating: "4.5",
      listenersReached: 300000,
      campaignBudget: "$150,000",
      campaignEffectiveness: "medium",
      deltaType: "unchanged",
    },
    // ... (add more sample campaign data similarly)
  ];
  
  export default function MusicCampaigns() {
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
    const isCampaignSelected = (campaign: MusicCampaign) =>
      selectedLabels.includes(campaign.labelName) || selectedLabels.length === 0;
  
    return (
      <Card>
        <MultiSelect
          onValueChange={setSelectedLabels}
          placeholder="Select Music Label..."
          className="max-w-xs"
        >
          {musicCampaigns.map((item) => (
            <MultiSelectItem key={item.labelName} value={item.labelName}>
              {item.labelName}
            </MultiSelectItem>
          ))}
        </MultiSelect>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Label Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Campaigns Run</TableHeaderCell>
              <TableHeaderCell className="text-right">Top Promoted Track</TableHeaderCell>
              <TableHeaderCell className="text-right">Track Rating</TableHeaderCell>
              <TableHeaderCell className="text-right">Listeners Reached</TableHeaderCell>
              <TableHeaderCell className="text-right">Campaign Budget</TableHeaderCell>
              <TableHeaderCell className="text-right">Effectiveness</TableHeaderCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {musicCampaigns
              .filter((item) => isCampaignSelected(item))
              .map((item) => (
                <TableRow key={item.labelName}>
                  <TableCell>{item.labelName}</TableCell>
                  <TableCell className="text-right">{item.campaignsRun}</TableCell>
                  <TableCell className="text-right">{item.topPromotedTrack}</TableCell>
                  <TableCell className="text-right">{item.trackRating}</TableCell>
                  <TableCell className="text-right">{item.listenersReached.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.campaignBudget}</TableCell>
                  <TableCell className="text-right">
                    <BadgeDelta deltaType={item.deltaType} size="xs">
                      {item.campaignEffectiveness}
                    </BadgeDelta>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    );
  }
  