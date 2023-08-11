import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import all components
import * as Components from './Components';

type SidebarItem = {
  title: string;
  route: string;
  component?: React.ComponentType<any>;
};

const SideNav = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    axios.get('https://thz.fm/api/resource/Website%20Sidebar/Main%20Website%20Menu')
      .then(response => {
        // Extract the sidebar_items array from the data
        const sidebarData = response.data.data.sidebar_items;
        // Map the sidebar items to the corresponding components
        const newNavItems = sidebarData.map(item => ({
          ...item,
          component: Components[item.title.replace(/\s+/g, '')],
        }));
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
