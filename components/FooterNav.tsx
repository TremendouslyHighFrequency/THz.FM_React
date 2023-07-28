import React, { useEffect, useState } from 'react';
import axios from 'axios';
import THZIcon from '../assets/Terahertz.png';
import FooterPlayer from './FooterPlayer';

type SidebarItem = {
  title: string;
  route: string;
  url: string;
};

type SidebarData = {
  sidebar_items: SidebarItem[];
};

// Add the new props
type FooterNavProps = {
  track: any; // Replace with the actual type of the track
  currentTime: number;
  duration: number;
};

const routeUrls: Record<string, string> = {
  '/blog': 'https://thz.fm/blog',
  '/about': 'https://thz.fm/about',
  '/roadmap': 'https://thz.fm/roadmap',
  '/career-application': 'https://thz.fm/career-application',
  '/creator-application': 'https://thz.fm/creator-application',
  '/legal': 'https://thz.fm/legal',
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
        const sidebarData: SidebarData = response.data.data;
        const newNavItems = sidebarData.sidebar_items.map(item => ({
          ...item,
          url: routeUrls[item.route] || item.route, // if the route is not in routeUrls, use the route itself
        }));
        setNavItems(newNavItems);
      })
      .catch(error => {
        console.error(`Error fetching side nav items: ${error}`);
      });
  }, []);

  return (
    <div className="footer-nav">
      <img className="footer-logo" src={THZIcon} alt="logo" />
      {navItems.map(item => (
        <div className="footer-link"><a target="_blank" key={item.route} href={item.url}>{item.title}</a></div>
      ))}
      {/* Add the FooterPlayer here */}
      {track && (
        <FooterPlayer 
          track={track}
          currentTime={currentTime}
          duration={duration}
        />
      )}
    </div>
  );
};

export default FooterNav;
export { SidebarItem, routeUrls };