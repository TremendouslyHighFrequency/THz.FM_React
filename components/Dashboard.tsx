import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';
import DashboardGraph from './DashboardGraph';
import DashboardCards from './DashboardCards';
import ReleaseMetrics from './ReleaseMetrics';
import SocialCampaigns from './SocialCampaigns';
import StakingMetrics from './Staking';

import {
  Card,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Metric,
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

      <TabGroup className="mt-6 mb-8">
        <TabList>
          <Tab>Sales</Tab>
          <Tab>Staking</Tab>
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
            <StakingMetrics />
          </TabPanel>

          <TabPanel>
            <ReleaseMetrics />
          </TabPanel>

          <TabPanel>
          <SocialCampaigns />
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
