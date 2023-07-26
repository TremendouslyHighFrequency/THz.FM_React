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

type SidebarData = {
  sidebar_items: SidebarItem[];
};

// Create a mapping of routes to components
const routeComponents: Record<string, React.ComponentType<any>> = {
  '/artists': Artists,
  '/publishers': Publishers,
  '/labels': Labels,
  '/releases': Releases,
  '/tracks': Tracks,
  '/events': Events,
  '/venues': Venues,
  '/z': Marketplace,
  '/dashboard': Dashboard,
  // add the route for labels and the other routes here...
};

const SideNav = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    axios.get('https://thz.fm/api/resource/Website%20Sidebar/Main%20Website%20Menu')
      .then(response => {
        // Extract the sidebar_items array from the data
        const sidebarData: SidebarData = response.data.data;
        // Transform the sidebar items to include the corresponding component
        const newNavItems = sidebarData.sidebar_items.map(item => ({
          ...item,
          component: () => routeComponents[item.route],
        }));
        setNavItems(newNavItems);
      })
      .catch(error => {
        console.error(`Error fetching side nav items: ${error}`);
      });
  }, []);

  return {navItems, links: (
    <div className="side-navContainer">
     <div className="side-nav">
      {navItems.map(item => (
        <li><Link key={item.route} to={item.route}>{item.title}</Link></li>
      ))}
      </div>
    </div>
  )};
};

export default SideNav;
export { SidebarItem, routeComponents };

