import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import your components


type SidebarItem = {
  title: string;
  route: string;
  url: string;
};

type SidebarData = {
  sidebar_items: SidebarItem[];
};

// Create a mapping of routes to URLs
const routeUrls: Record<string, string> = {
  '/blog': 'https://thz.fm/blog',
  '/about': 'https://thz.fm/about',
  '/roadmap': 'https://thz.fm/roadmap',
  '/career-application': 'https://thz.fm/career-application',
  '/creator-application': 'https://thz.fm/creator-application',
  '/legal': 'https://thz.fmlegal',
  '/github': 'https://github.com/TremendouslyHighFrequency',
  '/dao': 'https://thz.fm/dao',
  '/daw': 'https://thz.fm/daw',
  // add the other routes here...
};

const FooterNav = () => {
  const [navItems, setNavItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    axios.get('https://thz.fm/api/resource/Website%20Sidebar/Footer%20Nav')
      .then(response => {
        // Extract the sidebar_items array from the data
        const sidebarData: SidebarData = response.data.data;
        // Transform the sidebar items to include the corresponding url
        const newNavItems = sidebarData.sidebar_items.map(item => ({
          ...item,
          url: routeUrls[item.route],
        }));
        setNavItems(newNavItems);
      })
      .catch(error => {
        console.error(`Error fetching side nav items: ${error}`);
      });
  }, []);

  return (
    <div className="footer-nav">
      {navItems.map(item => (
        <div className="footer-link"><a key={item.route} href={item.url}>{item.title}</a></div>
      ))}
    </div>
  );
};

export default FooterNav;
export { SidebarItem, routeUrls };

