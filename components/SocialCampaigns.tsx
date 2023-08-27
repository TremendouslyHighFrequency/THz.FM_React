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

type MusicLabel = {
    name: string;
    albumsReleased: number;
    topTrack: string;
    topTrackRating: string;
    country: string;
    status: string;
    deltaType: DeltaType;
  };
  

  const musicLabels: MusicLabel[] = [
    {
      name: "Alpha Records",
      albumsReleased: 20,
      topTrack: "Echoes of Silence",
      topTrackRating: "4.8",
      country: "USA",
      status: "renowned",
      deltaType: "increase",
    },
    {
      name: "Beta Sounds",
      albumsReleased: 15,
      topTrack: "Moonlight Serenade",
      topTrackRating: "4.5",
      country: "UK",
      status: "emerging",
      deltaType: "unchanged",
    },
];

export default function MusicCampaigns() {
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
    const isLabelSelected = (label: MusicLabel) =>
      selectedLabels.includes(label.name) || selectedLabels.length === 0;
  
    return (
      <Card>
        <MultiSelect
          onValueChange={setSelectedLabels}
          placeholder="Select Music Label..."
          className="max-w-xs"
        >
          {musicLabels.map((item) => (
            <MultiSelectItem key={item.name} value={item.name}>
              {item.name}
            </MultiSelectItem>
          ))}
        </MultiSelect>
        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Albums Released</TableHeaderCell>
              <TableHeaderCell className="text-right">Top Track</TableHeaderCell>
              <TableHeaderCell className="text-right">Top Track Rating</TableHeaderCell>
              <TableHeaderCell className="text-right">Country</TableHeaderCell>
              <TableHeaderCell className="text-right">Status</TableHeaderCell>
            </TableRow>
          </TableHead>
  
          <TableBody>
            {musicLabels
              .filter((item) => isLabelSelected(item))
              .map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.albumsReleased}</TableCell>
                  <TableCell className="text-right">{item.topTrack}</TableCell>
                  <TableCell className="text-right">{item.topTrackRating}</TableCell>
                  <TableCell className="text-right">{item.country}</TableCell>
                  <TableCell className="text-right">
                    <BadgeDelta deltaType={item.deltaType} size="xs">
                      {item.status}
                    </BadgeDelta>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    );
  }