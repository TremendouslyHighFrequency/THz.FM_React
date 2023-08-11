import React, { useEffect, useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types'; // Define the ReleaseItem type according to the Release document structure
import { getLoggedUser } from './components/api'; // Update with the correct path
import { Table, Button } from '@radix-ui/themes';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDownIcon } from '@radix-ui/react-icons'; // Import or replace this icon as per your UI library
import '@radix-ui/themes/styles.css';

const CreateRelease = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    getLoggedUser()
      .then((user) => setLoggedUser(user))
      .catch((error) => console.error(error));
  }, []);

  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release', {
    fields: ["title", "release_artist", "release_artwork", "name", "release_id"],
    filters: loggedUser ? { "owner": loggedUser } : {},
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "release_id",
      order: 'asc'
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
      <div className="releases-index">
        <div className="manageList">
          <Table.Root>
            <Table.Header>
              <Table.Row className="px-12">
                <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Artist</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Release ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Unique ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map(({ title, release_artist, release_id, name }, i) => (
                <Table.Row key={i}>
                  <Table.RowHeaderCell>{title}</Table.RowHeaderCell>
                  <Table.Cell>{release_artist}</Table.Cell>
                  <Table.Cell>{release_id}</Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button>
                          Options
                          <CaretDownIcon />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                        {/* Add the appropriate onSelect functions for each menu item */}
                        <DropdownMenu.Item className="DropdownMenuItem">Edit</DropdownMenu.Item>
                        <DropdownMenu.Item className="DropdownMenuItem">Duplicate</DropdownMenu.Item>
                        <DropdownMenu.Item className="DropdownMenuItem">Archive</DropdownMenu.Item>
                        <DropdownMenu.Item className="DropdownMenuItem" color="red">Delete</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        </div>
      </div>
    );
  }
  return null;
};

export default CreateRelease;
