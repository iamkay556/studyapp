import React, { useState, useEffect } from "react"; 

const Pomo = () => { 

    const [time, setTime] = useState(60 * 60); 
    const [isRunning, setIsRunning] = useState(false); 
    const [showSettings, setShowSettings] = useState(false); 
    const [currentSession, setCurrentSession] = useState("work");

    const [settings, setSettings] = useState({ 
        work: 60,          
        shortBreak: 10,
        longBreak: 30,
    });

    useEffect(() => { 
        let interval;
        if (isRunning) { 
            interval = setInterval(() => {
                setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); 
            }, 1000);
        } else {
            clearInterval(interval); 
        }
        return () => clearInterval(interval); 
    }, [isRunning]);

    const toggleTimer = () => { 
        setIsRunning(!isRunning);
    };

    const resetTimer = () => { 
        setTime(settings.work * 60); 
        setIsRunning(false);
    };

    const openSettings = () => { 
        setShowSettings(true);
    };

    const closeSettings = () => { 
        setShowSettings(false);
    };

    const saveSettings = (e) => { 
        e.preventDefault(); // page doesnt refresh when form submit
        const work = parseInt(e.target.work.value, 10); 
        const shortBreak = parseInt(e.target.shortBreak.value, 10); 
        const longBreak = parseInt(e.target.longBreak.value, 10); 

        setSettings({ work, shortBreak, longBreak }); 
        setTime(work * 60); // reset timer when save
        closeSettings(); 
    };

    const formatTime = (timeInSeconds) => { // into minutes:seconds format
        const minutes = Math.floor(timeInSeconds / 60); 
        const seconds = timeInSeconds % 60; 
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`; // leading 0s
    };

    const switchSession = (direction) => {
        if (direction === "next") {
            if (currentSession === "work") {
                setCurrentSession("shortBreak");
                setTime(settings.shortBreak * 60);
            } else if (currentSession === "shortBreak") {
                setCurrentSession("longBreak");
                setTime(settings.longBreak * 60);
            } else if (currentSession === "longBreak") {
                setCurrentSession("work");
                setTime(settings.work * 60);
            }
        } else if (direction === "prev") {
            if (currentSession === "work") {
                setCurrentSession("longBreak");
                setTime(settings.longBreak * 60);
            } else if (currentSession === "shortBreak") {
                setCurrentSession("work");
                setTime(settings.work * 60);
            } else if (currentSession === "longBreak") {
                setCurrentSession("shortBreak");
                setTime(settings.shortBreak * 60);
            }
        }
        setIsRunning(false);
    };

    return ( 
        <div className="pomodoro-container">
            <h1 className="pomodoro-title">Pomodoro Timer</h1> 
            <h2 className="current-session">Current Session: {currentSession}</h2>
            
            <div className="timer-display">{formatTime(time)}</div> 
            
            <div className="timer-controls"> 
                <button className="control-button" onClick={toggleTimer}>
                    {isRunning ? "Pause" : "Start"} 
                </button>
                <button className="control-button" onClick={resetTimer}>
                    Reset 
                </button>
                <button className="control-button" onClick={openSettings}>
                    Settings 
                </button>
            </div>

            <div className="session-switcher">
                <button className="arrow-button" onClick={() => switchSession("prev")}>
                    ← Previous
                </button>
                <button className="arrow-button" onClick={() => switchSession("next")}>
                    Next →
                </button>
            </div>

            {showSettings && ( 
                <div className="settings-modal">
                    <div className="settings-content">
                        <h2>Settings</h2> 
                        <form onSubmit={saveSettings}> 
                            <label>
                                Work (minutes):
                                <input
                                    type="number"
                                    name="work"
                                    defaultValue={settings.work} 
                                    min="1"
                                />
                            </label>
                            <label>
                                Short Break (minutes):
                                <input
                                    type="number"
                                    name="shortBreak"
                                    defaultValue={settings.shortBreak} 
                                    min="1"
                                />
                            </label>
                            <label>
                                Long Break (minutes):
                                <input
                                    type="number"
                                    name="longBreak"
                                    defaultValue={settings.longBreak} 
                                    min="1"
                                />
                            </label>
                            <div className="settings-buttons">
                                <button type="submit" className="save-button">
                                    Save 
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeSettings}
                                >
                                    Cancel 
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pomo; 