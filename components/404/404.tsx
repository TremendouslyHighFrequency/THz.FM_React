
import React, { useState } from 'react';

const Error404: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState('');
    
    return (
        <div className="content">
            <div className="overflow-hidden">
                <div className="relative flex h-screen text-gray-800 bg-white font-roboto">
                    {sidebarOpen && (
                        <div 
                            className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden" 
                            onClick={() => setSidebarOpen(false)}
                        ></div>
                    )}
                    <div className={sidebarOpen ? "fixed inset-y-0 left-0 z-30 w-64 px-4 overflow-y-auto transition duration-200 transform bg-white border-r border-gray-100 lg:translate-x-0 lg:relative lg:inset-0" : "fixed inset-y-0 left-0 z-30 w-64 px-4 overflow-y-auto transition duration-200 transform -translate-x-full bg-white border-r border-gray-100 lg:translate-x-0 lg:relative lg:inset-0"}>
                        {/* Sidebar content goes here */}
                        <div className="flex items-center mt-8">
                            <img className="w-auto h-8" src="/assets/images/full-logo.svg" alt="" />
                        </div>

                        <hr className="my-6 border-gray-100" />

                        <nav className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="px-4 text-sm tracking-wider text-gray-400 uppercase">PAGES</h3>

                                <a className="flex items-center px-4 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 transform rounded-lg bg-opacity-40" href="/">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="mx-3 font-medium capitalize">Dashboard</span>
                                </a>

                                {/* ... Other Sidebar Items ... */}
                            </div>
                            {/* ... Other Sidebar Sections ... */}
                        </nav>
                    </div>

                    {/* ... Rest of the content ... */}
                </div>
            </div>
        </div>
    );
};

export default Error404;
