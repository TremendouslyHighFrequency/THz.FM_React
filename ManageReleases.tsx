import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types'; // Define the ReleaseItem type according to the Release document structure
import { getLoggedUser } from './components/api'; // Update with the correct path
import { Table, Button, Badge } from '@radix-ui/themes';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import '@radix-ui/themes/styles.css';
import { CreateRelease } from './components/CreateRelease';

const ManageReleases = () => {
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

  if (!loggedUser) {
    return null; // Or you can return a loading state or another placeholder
  }

  if (isValidating) {
    return <>Loading</>;
  }

  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  if (data && Array.isArray(data) && data.length > 0) {
    return (
      <div className="createRelease">
        <div className="publishedReleases">
          <section className="container px-4 mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Releases:</h2>
              <div className="flex items-center mt-4 gap-x-3">
              <button className="flex items-center justify-center w-1/2 m-6 px-5 py-2 text-sm tracking-wide shadow-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><Link to={`/create-release`} element={<CreateRelease />}>Add Release</Link></span>
            </button>
              </div>
            </div>
          </section>
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <Table.Root className="min-w-full divide-y divide-gray-200">
                <Table.Header className="bg-gray-50">
                  <Table.Row className="px-12 bg-gray-50">
                    <Table.ColumnHeaderCell className="align-middle text-center">Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Primary Artist</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Label</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Catalog</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Release Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cover Artwork</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="align-middle text-center">Action</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map(({ title, release_artist, release_id, name, release_label, release_date, release_artwork, published }, i) => (
                    <Table.Row key={i} className="bg-gray-50">
                      <Table.RowHeaderCell className="align-middle text-center">{title}</Table.RowHeaderCell>
                      <Table.Cell className="align-middle text-center">{release_artist}</Table.Cell>
                      <Table.Cell className="align-middle text-center">{release_label}</Table.Cell>
                      <Table.Cell className="align-middle text-center">  
                        {published ? 
                       <span className="px-2 py-1 rounded-md bg-blue-300 text-blue-900 border-gray-200">Published</span> 
                        : 
                        <span className="px-2 py-1 rounded-md bg-orange-300 text-orange-900 border-gray-200">Draft</span>
                        }
                        </Table.Cell>
                      <Table.Cell className="align-middle text-center">{release_id}</Table.Cell>
                      <Table.Cell className="align-middle text-center">{release_date}</Table.Cell>
                      <Table.Cell><img width={96} height={96} src={release_artwork} /></Table.Cell>
                      <Table.Cell className="align-middle text-center">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                          <button class="px-1 py-1 text-gray-500 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                        </svg>
                                    </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                            <DropdownMenu.Item className="DropdownMenuItem">Edit</DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem">Archive</DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" color="red">Delete</DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              {data.length >= 50 && (
                <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } if (data && Array.isArray(data) && data.length === 0) {
    return (
      <div className="flex items-center mt-6 text-center border rounded-lg h-96 dark:border-gray-700">
        <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
          <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h1 className="mt-3 text-lg text-gray-800 dark:text-white">No releases found</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">You don't have any releases. Click the button to add one.</p>
          <div className="flex items-center mt-4 sm:mx-auto gap-x-3">
           
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><Link to={`/create-release`} element={<CreateRelease />}>Add Release</Link></span>
            </button>
          </div>
        </div>
      </div>
      );
    }
  
    return null;
  };
  
  export default ManageReleases;
