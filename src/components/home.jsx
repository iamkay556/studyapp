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
                <h1 className="homepage-title">STUDY APP BY KAY</h1>
                <p className="homepage-description">
                    Made for study.
                </p>
                <div className="homepage-buttons">
                    <button
                        className="homepage-button"
                        onClick={() => handleNavigation('/pomodoro')}
                    >
                        Pomodoro
                    </button>
                    <button
                        className="homepage-button"
                        onClick={() => handleNavigation('/tasks')}
                    >
                        Tasks
                    </button>
                    <button
                        className="homepage-button"
                        onClick={() => handleNavigation('/schedule')}
                    >
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;