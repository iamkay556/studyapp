import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doSignOut } from '../auth';
import { auth } from '../firebase';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    console.log(userLoggedIn);

    const handleLogout = async () => {
        await doSignOut(auth);
        navigate('/login'); // Logout redirects to the login page
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true); // Add blur effect on scroll
            } else {
                setIsScrolled(false); // Remove blur effect on top
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`navbar ${isScrolled ? 'nav-blur' : ''}`}>
            <div className="menu-toggle">☰</div>
            <nav className={`nav-links ${isScrolled ? 'show' : 'hide'}`}>
                <div className="logoimg">STUDY APP BY KAY</div>
                {userLoggedIn ? (
                    <>
                        <div className="nav-link" onClick={() => navigate('/home')}>
                            Home
                        </div>
                        <div className="nav-link" onClick={() => navigate('/pomodoro')}>
                            Pomodoro
                        </div>
                        <div className="nav-link" onClick={() => navigate('/schedule')}>
                            Schedule
                        </div>
                        <div className="nav-link" onClick={() => navigate('/tasks')}>
                            Tasks
                        </div>
                        <div className="nav-link navlink-logout" onClick={handleLogout}>
                            Logout
                        </div>
                    </>
                ) : (
                    <div className="nav-link" onClick={() => navigate('/login')}>Please log in</div>
                )}
                <div className="hide-toggle">✖</div>
            </nav>
        </header>
    );
};

export default Header;