import React, { useState, useEffect } from 'react';

function App() {
    const [sessions, setSessions] = useState([]);
    const [energy, setEnergy] = useState('');
    const [price, setPrice] = useState('');
    const [bestTime, setBestTime] = useState('');

    const fetchSessions = async () => {
        const response = await fetch('/api/charging/sessions');
        const data = await response.json();
        setSessions(data);
    };

    const startCharging = async (energyPercentage) => {
        await fetch(`/api/charging/charge?energyPercentage=${energyPercentage}`, {
            method: 'POST'
        });
        fetchSessions();
    };

    const getBestTimeToCharge = async () => {
        const response = await fetch('/api/charging/best-price-time');
        const data = await response.json();
        setBestTime(data);
    };

    useEffect(() => {
        fetchSessions();
        getBestTimeToCharge();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>BMS Charging Dashboard</h1>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => startCharging(20)}>Ladda till 20%</button>
                <button onClick={() => startCharging(80)}>Ladda till 80%</button>
                <button onClick={() => startCharging(100)}>Ladda till 100%</button>
            </div>
            <h2>Charging Sessions</h2>
            <ul>
                {sessions.map((session) => (
                    <li key={session.id}>
                        {session.energyKWh} kWh at {session.pricePerKWh} SEK/kWh
                        (Start: {session.startTime}, End: {session.endTime})
                    </li>
                ))}
            </ul>
            <h3>Bästa tid att ladda:</h3>
            <p>{bestTime}</p>
        </div>
    );
}

export default App;
