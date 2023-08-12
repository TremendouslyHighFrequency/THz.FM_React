import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types'; // Define the ReleaseItem type according to the Release document structure
import { getLoggedUser } from './components/api'; // Update with the correct path
import { Table, Button } from '@radix-ui/themes';
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
    fields: ["title", "release_artist", "release_artwork", "name", "release_id", "release_label", "release_date"],
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
                <button className="w-1/2 px-5 py-2 text-sm text-gray-800 transition-colors duration-200 bg-white border rounded-lg sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-white dark:border-gray-700">
                <Link to={`/create-release`} element={<CreateRelease />}>Create Release</Link>
                </button>
                <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_3098_154395)">
                      <path d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832" stroke="currentColor" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3098_154395">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </section>
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <Table.Root className="min-w-full divide-y divide-gray-200">
                <Table.Header className="bg-gray-50">
                  <Table.Row className="px-12">
                    <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Primary Artist</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Catalog</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Release Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Unique ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map(({ title, release_artist, release_id, name, release_label, release_date }, i) => (
                    <Table.Row key={i}>
                      <Table.RowHeaderCell>{title}</Table.RowHeaderCell>
                      <Table.Cell>{release_artist}</Table.Cell>
                      <Table.Cell>{release_label}</Table.Cell>
                      <Table.Cell>{release_id}</Table.Cell>
                      <Table.Cell>{release_date}</Table.Cell>
                      <Table.Cell>{name}</Table.Cell>
                      <Table.Cell>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="inline-block bg-indigo-400 rounded-md px-2 py-1 text-sm my-2 shadow-sm">
                              Manage
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
              <span>Add vendor</span>
            </button>
          </div>
        </div>
      </div>
      );
    }
  
    return null;
  };
  
  export default ManageReleases;
