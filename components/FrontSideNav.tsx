import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import your components
import Artists from './Artists';
import Publishers from './Publishers';
import Labels from './Labels';
import Releases from './Releases';
import Tracks from './Tracks';
import Events from './Events';
import Venues from './Venues';
import Marketplace from './Marketplace';
import Dashboard from './Dashboard';

type SidebarItem = {
  title: string;
  route: string;
  component?: React.ComponentType<any>;
};

const componentsMap = {
  Artists,
  Publishers,
  Labels,
  Releases,
  Tracks,
  Events,
  Venues,
  Marketplace,
  Dashboard,
};

const SideNav = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    axios.get('https://thz.fm/api/resource/Website%20Sidebar/Main%20Website%20Menu')
      .then(response => {
        // Extract the sidebar_items array from the data
        const sidebarData = response.data.data.sidebar_items;
        // Map the sidebar items to the corresponding components
        const newNavItems = sidebarData.map(item => {
          const componentName = item.title.replace(/\s+/g, ''); // Remove spaces
          return {
            ...item,
            component: componentsMap[componentName],
          };
        });
        setNavItems(newNavItems);
      })
      .catch(error => {
        console.error(`Error fetching side nav items: ${error}`);
      });
  }, []);

  return (
    <div className="side-navContainer">
      <ul className="side-nav">
        {navItems.map(item => (
          <li key={item.route}><Link to={item.route}>{item.title}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default SideNav;
