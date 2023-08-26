import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';
import DashboardGraph from './DashboardGraph';
import DashboardCards from './DashboardCards';

import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Metric
  Title,
  Subtitle,
  Text,
  Bold,
  Italic,
} from "@tremor/react";

const Dashboard = () => {
  const {
    currentUser
  } = useFrappeAuth();

  return (
    <div className="content">
      {currentUser ? (
        <>
          <main>
      <Metric>Dashboard</Metric>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Sales</Tab>
          <Tab>Release Metrics</Tab>
          <Tab>Social Campaigns</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            
              <DashboardCards />
            <div className="mt-6">
             
              
                  <DashboardGraph />
                
              
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card>
                <div className="h-96" />
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
        </>
      ) : (
        <h1>Please login to view this page.</h1>
      )}
    </div>
  );
};

export default Dashboard;
