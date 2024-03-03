import React from "react";
import styles from '../styles/UserProfileHeader.css';
import { Button } from "./ui/moving-border";

class Header extends React.Component {
    render() {
        return (
            <nav className="Nav px-4 py-2 flex justify-between items-center w-full">
                <div className="Nav-brand">
                    <h4 className="text-2xl md:text-5xl font-bold dark:text-white">
                        GenVidea
                    </h4>
                </div>

                <div className="flex items-center">
                    <a href="/">
                    <button className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800">
                        Logout
                    </button>
                    <button className="text-white ml-4 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors">
                        <i className="fas fa-cog"></i>
                    </button>
                    </a>
                </div>
            </nav>
        );
    }
}
export default Header;