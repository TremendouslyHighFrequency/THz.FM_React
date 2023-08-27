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

type Publisher = {
    name: string;
    booksPublished: number;
    bestSeller: string;
    averageRating: string;
    country: string;
    status: string;
    deltaType: DeltaType;
  };
  

  const publishers: Publisher[] = [
    {
      name: "Alpha Publishers",
      booksPublished: 150,
      bestSeller: "Mystery of the Mountain",
      averageRating: "4.5",
      country: "USA",
      status: "leading",
      deltaType: "increase",
    },
    {
        name: "Beta Publishers",
        booksPublished: 150,
        bestSeller: "Mystery of the Mountain",
        averageRating: "4.5",
        country: "USA",
        status: "leading",
        deltaType: "increase",
      },
      {
        name: "Gamma Publishers",
        booksPublished: 150,
        bestSeller: "Mystery of the Mountain",
        averageRating: "4.5",
        country: "USA",
        status: "leading",
        deltaType: "increase",
      },
      {
        name: "Sigma Publishers",
        booksPublished: 150,
        bestSeller: "Mystery of the Mountain",
        averageRating: "4.5",
        country: "USA",
        status: "leading",
        deltaType: "increase",
      },
      {
        name: "Theta Publishers",
        booksPublished: 150,
        bestSeller: "Mystery of the Mountain",
        averageRating: "4.5",
        country: "USA",
        status: "leading",
        deltaType: "increase",
      },
];

export default function SocialCampaigns() {
    const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  
    const isPublisherSelected = (publisher: Publisher) =>
      selectedPublishers.includes(publisher.name) || selectedPublishers.length === 0;
  
      return (
        <Card>
          <MultiSelect
            onValueChange={setSelectedPublishers}
            placeholder="Select Publisher..."
            className="max-w-xs"
          >
            {publishers.map((item) => (
              <MultiSelectItem key={item.name} value={item.name}>
                {item.name}
              </MultiSelectItem>
            ))}
          </MultiSelect>
          <Table className="mt-6">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell className="text-right">Books Published</TableHeaderCell>
                <TableHeaderCell className="text-right">Best Seller</TableHeaderCell>
                <TableHeaderCell className="text-right">Average Rating</TableHeaderCell>
                <TableHeaderCell className="text-right">Country</TableHeaderCell>
                <TableHeaderCell className="text-right">Status</TableHeaderCell>
              </TableRow>
            </TableHead>
    
            <TableBody>
              {publishers
                .filter((item) => isPublisherSelected(item))
                .map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.booksPublished}</TableCell>
                    <TableCell className="text-right">{item.bestSeller}</TableCell>
                    <TableCell className="text-right">{item.averageRating}</TableCell>
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