import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import your components


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
  '/blog': 'https://thz.fm/blog',
  '/about': 'https://thz.fm/about',
  '/roadmap': 'https://thz.fm/roadmap',
  '/career-application': 'https://thz.fm/career-application',
  '/creator-application': 'https://thz.fm/creator-application',
  '/legal': 'https://thz.fmlegal',
  '/github': 'https://github.com/TremendouslyHighFrequency',
  '/dao': 'https://thz.fm/dao',
  '/daw': 'https://thz.fm/daw',
  // add the route for labels and the other routes here...
};

const FooterNav = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    axios.get('https://thz.fm/api/resource/Website%20Sidebar/Footer%20Nav')
      .then(response => {
        // Extract the sidebar_items array from the data
        const sidebarData: SidebarData = response.data.data;
        // Transform the sidebar items to include the corresponding component
        const newNavItems = sidebarData.sidebar_items.map(item => ({
          ...item,
          component: routeComponents[item.route],
        }));
        setNavItems(newNavItems);
      })
      .catch(error => {
        console.error(`Error fetching side nav items: ${error}`);
      });
  }, []);

  return {navItems, links: (
    <div className="footer-nav">
      {navItems.map(item => (
        <Link key={item.route} to={item.route}>{item.title}</Link>
      ))}
    </div>
  )};
};

export default FooterNav;
export { SidebarItem, routeComponents };

