import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        if (currentUser) {
            navigate(path);
        } else {
            navigate('/login'); 
        }
    };

    return (
        <div className="homepage-container">
            <div className="homepage-content">
                <h1 className="homepage-title">didn't finish this one.</h1>
                <p className="homepage-description">
                    soon??
                </p>
            </div>
        </div>
    );
};

export default Home;