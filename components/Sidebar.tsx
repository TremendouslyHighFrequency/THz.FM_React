import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <div>
               <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    {/* Removed the toggle button from here */}
                </div>
                <div className="sidebar-content">
                    <ul className="sidebar-list">
                        <li className="sidebar-item">
                            <NavLink to="/dashboard" activeClassName="active">
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="sidebar-item">
                            <NavLink to="/projects" activeClassName="active">
                                Projects
                            </NavLink>
                        </li>
                        <li className="sidebar-item">
                            <NavLink to="/settings" activeClassName="active">
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
             {/* Toggle button outside the sidebar */}
            <button onClick={toggle} className="sidebar-toggle static ml-12">
                Toggle
            </button>
        </div>
    );
};

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
};

export default Sidebar;
