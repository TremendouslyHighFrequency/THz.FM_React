import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types';
import { getLoggedUser } from './components/api';
import {
  Card,
  Flex,
  Title,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Button,
} from "@tremor/react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import '@radix-ui/themes/styles.css';
import CreateRelease from './components/CreateRelease';

const ManageReleases = () => {
  const {
    currentUser
  } = useFrappeAuth();

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    getLoggedUser()
      .then((user) => setLoggedUser(user))
      .catch((error) => console.error(error));
  }, []);

  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release', {
    fields: ["title", "release_artist", "release_artwork", "name", "release_id", "release_label", "release_date", "published"],
    filters: loggedUser ? { "owner": loggedUser } : {},
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "release_id",
      order: 'asc'
    }
  });

  if (!loggedUser) return null;
  if (isValidating) return <>Loading</>;
  if (error) return <>{JSON.stringify(error)}</>;

  return (
    
    <div className="createRelease">
       {currentUser ? (
        <>
              <div className="publishedReleases">
        <section className="container px-4 mx-auto">
          <Flex justifyContent="start" className="space-x-2">
            <Title>Releases:</Title>
            <Button>
              <Link to={`/create-release`} element={<CreateRelease />}>
                Add Release
              </Link>
            </Button>
          </Flex>
        </section>

        <Card className="mt-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Primary Artist</TableHeaderCell>
                <TableHeaderCell>Label</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Catalog</TableHeaderCell>
                <TableHeaderCell>Release Date</TableHeaderCell>
                <TableHeaderCell>Cover Artwork</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map(({ title, release_artist, release_id, release_label, release_date, release_artwork, published }, i) => (
                <TableRow key={i}>
                  <TableCell>{title}</TableCell>
                  <TableCell>{release_artist}</TableCell>
                  <TableCell>{release_label}</TableCell>
                  <TableCell>
                    <Badge color={published ? "blue" : "orange"}>
                      {published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{release_id}</TableCell>
                  <TableCell>{release_date}</TableCell>
                  <TableCell><img width={96} height={96} src={release_artwork} alt="Cover Artwork" /></TableCell>
                  <TableCell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        ⋮
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item>Edit</DropdownMenu.Item>
                        <DropdownMenu.Item>Publish / Unpublish</DropdownMenu.Item>
                        <DropdownMenu.Item>Delete</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data.length >= 50 && (
            <Button onClick={() => setPageIndex(pageIndex + 50)}>Next page</Button>
          )}
        </Card>

        {data.length === 0 && (
          <div className="flex items-center mt-6 text-center border rounded-lg h-96">
            <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
              <h1 className="mt-3 text-lg">No releases found</h1>
              <p>You don't have any releases. Click the button to add one.</p>
              <Button>
                <Link to={`/create-release`} element={<CreateRelease />}>
                  Add Release
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      </>
      ) : (
        <h1>Please login to view this page.</h1>
      )}
    </div>
    
  );
};

export default ManageReleases;
