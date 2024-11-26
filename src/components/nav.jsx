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
        <header className={`headernav ${isScrolled ? 'nav-blur' : ''}`}>
            {userLoggedIn ? (
                <nav className="headernav">
                    <div>
                        <div>STUDY APP BY KAY</div>
                    </div>
                    <div
                        className="navlink"
                        style={{ cursor: 'pointer', color: 'white', margin: '0 10px' }}
                        onClick={() => navigate('/home')}
                    >
                        Home
                    </div>
                    <div
                        className="navlink"
                        style={{ cursor: 'pointer', color: 'white', margin: '0 10px' }}
                        onClick={() => navigate('/pomodoro')}
                    >
                        Pomodoro
                    </div>
                    <div
                        className="navlink"
                        style={{ cursor: 'pointer', color: 'white', margin: '0 10px' }}
                        onClick={() => navigate('/schedule')}
                    >
                        Schedule
                    </div>
                    <div
                        className="navlink"
                        style={{ cursor: 'pointer', color: 'white', margin: '0 10px' }}
                        onClick={() => navigate('/tasks')}
                    >
                        Tasks
                    </div>
                    <div className="navlink-logout" onClick={handleLogout}>
                        Logout
                    </div>
                </nav>
            ) : (
                <nav className="headernav">
                    <div>
                        <div>STUDY APP BY KAY</div>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;