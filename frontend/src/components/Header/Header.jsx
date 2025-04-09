import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="header">
            <img
                src="/assets/amity-logo.png" // Ensure the logo is placed in the public/assets folder
                alt="Amity Logo"
                className="header-logo"
            />
        </div>
    );
};

export default Header;
