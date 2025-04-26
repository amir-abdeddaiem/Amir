"use client";
import { PawPrint, User, Settings, Bell, HeartPulse, ClipboardList, LogOut, Sun, Moon, Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard");

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const navItems = [
        { name: "Dashboard", icon: PawPrint, href: "#", badge: 0 },
        { name: "Patients", icon: HeartPulse, href: "#", badge: 5 },
        { name: "Appointments", icon: ClipboardList, href: "#", badge: 2 },
        { name: "Notifications", icon: Bell, href: "#", badge: 3 },
        { name: "Profile", icon: User, href: "#" },
        { name: "Settings", icon: Settings, href: "#" },
    ];

    return (
        <div className={`
            h-screen 
            ${isCollapsed ? "w-20" : "w-64"} 
            bg-white dark:bg-gray-900 
            text-gray-800 dark:text-white 
            flex flex-col 
            p-4 
            transition-all duration-300 ease-in-out
            border-r border-gray-200 dark:border-gray-700
            shadow-lg
            relative
            backdrop-blur-sm bg-opacity-90
        `}>
            
            {/* **Collapse Button** */}
            <button
                onClick={toggleSidebar}
                className={`
                    mb-6 p-2 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-gray-800 
                    transition-all
                    flex items-center justify-center
                    focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500
                `}
                aria-label={isCollapsed ? "Expand" : "Collapse"}
            >
                {isCollapsed ? (
                    <Menu className="h-5 w-5" />
                ) : (
                    <div className="flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="text-sm">Collapse</span>
                    </div>
                )}
            </button>

            {/* **Main Navigation** */}
            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`
                            flex items-center gap-3 
                            p-3 rounded-lg 
                            transition-all duration-200
                            ${activeItem === item.name 
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                            ${isCollapsed ? "justify-center" : ""}
                        `}
                        onClick={() => setActiveItem(item.name)}
                    >
                        <div className="relative">
                            <item.icon className="h-5 w-5" />
                            {item.badge && item.badge > 0 && !isCollapsed && (
                                <span className={`
                                    absolute -top-1 -right-1
                                    bg-red-400 dark:bg-red-500 text-white 
                                    text-xs font-bold
                                    rounded-full h-5 w-5
                                    flex items-center justify-center
                                `}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        {!isCollapsed && (
                            <span className="text-sm font-medium">{item.name}</span>
                        )}
                    </Link>
                ))}
            </nav>

            {/* **Bottom Section (Dark Mode & Logout)** */}
            <div className="mt-auto flex flex-col gap-2">
                {/* Dark Mode Toggle */}
               
                {/* Logout Button */}
                <Link
                    href="#"
                    className={`
                        flex items-center gap-3 
                        p-3 rounded-lg 
                        hover:bg-gray-100 dark:hover:bg-gray-800 
                        transition-all
                        ${isCollapsed ? "justify-center" : ""}
                    `}
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span className="text-sm">Logout</span>}
                </Link>
            </div>

            {/* **Paw Print Decoration (Subtle)** */}
            {!isCollapsed && (
                <div className="absolute bottom-4 left-4 opacity-20">
                    <PawPrint size={40} className="text-gray-400 dark:text-white" />
                </div>
            )}
        </div>
    );
}
