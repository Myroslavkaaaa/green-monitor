import React, { useEffect, useState } from 'react';
import { Routes, Route, Link} from 'react-router-dom';

function Zones() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/zones')
            .then(res => res.json())
            .then(data => {
                setZones(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Помилка');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Завантаження зон...</div>;
    if (error) return <div>Помилка завантаження</div>;

    return (
        <div>
            <h2>🌱 Зони теплиць ({zones.length})</h2>
            {zones.map(zone => (
                <div key={zone._id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 10 }}>
                    <h3>{zone.name}</h3>
                    <p>Культура: {zone.cropType}</p>
                    <p>Температура: {zone.optimalParams?.minTemp}-{zone.optimalParams?.maxTemp}°C</p>
                </div>
            ))}
        </div>
    );
}

function Sensors() {
    const [sensors, setSensors] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/sensors')
            .then(res => res.json())
            .then(setSensors);
    }, []);
    return (
        <div>
            <h2>📡 Сенсори ({sensors.length})</h2>
            {sensors.map(sensor => (
                <div key={sensor._id}>
                    {sensor.name} ({sensor.type}) - {sensor.isActive ? 'ACTIVE' : 'NOT ACTIVE'}
                </div>
            ))}
        </div>
    );
}

function Alerts() {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/alerts')
            .then(res => res.json())
            .then(setAlerts);
    }, []);
    return (
        <div>
            <h2>🚨 Алерти ({alerts.length})</h2>
            {alerts.map(alert => (
                <div key={alert._id} style={{ color: alert.status === 'active' ? 'red' : 'green' }}>
                    {alert.message}
                </div>
            ))}
        </div>
    );
}

// Конфігурація
const APP_CONFIG = {
    version: '1.0.0-dev',
    status: 'LOCAL',
    mode: 'development',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
};

// DEBUG .env
/*console.table({
    'VITE_APP_VERSION': import.meta.env.VITE_APP_VERSION,
    'VITE_APP_STATUS': import.meta.env.VITE_APP_STATUS,
    'MODE': import.meta.env.MODE,
    'API_URL': APP_CONFIG.apiUrl
});*/

function App() {
/*

    const version = import.meta.env.VITE_APP_VERSION || 'dev';
    const status = import.meta.env.VITE_APP_STATUS || 'LOCAL MODE';
    const mode = import.meta.env.VITE_APP_MODE || import.meta.env.MODE || 'unknown';
*/

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: 30 }}>
                <h1>GreenMonitor</h1>
            </header>

            {/* КНОПКИ-НАВІГАЦІЯ */}
            <nav style={{
                display: 'flex',
                gap: 10,
                marginBottom: 30,
                padding: 15,
                background: '#f5f5f5',
                borderRadius: 10
            }}>
                <Link
                    to="/zones"
                    style={{ padding: '12px 24px', background: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: 6 }}
                >
                    Зони
                </Link>
                <Link
                    to="/sensors"
                    style={{ padding: '12px 24px', background: '#2196F3', color: 'white', textDecoration: 'none', borderRadius: 6 }}
                >
                    Сенсори
                </Link>
                <Link
                    to="/alerts"
                    style={{ padding: '12px 24px', background: '#ff4444', color: 'white', textDecoration: 'none', borderRadius: 6 }}
                >
                    Алерти
                </Link>
            </nav>

            {/* РОУТИ */}
            <Routes>
                <Route path="/zones" element={<Zones />} />
                <Route path="/sensors" element={<Sensors />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/" element={<Zones />} />
            </Routes>
            <footer style={{
                background: '#343a40',
                color: '#adb5bd',
                padding: '1.5rem 2rem',
                textAlign: 'center',
                marginTop: '2rem'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    GreenMonitor <strong>v{APP_CONFIG.version}</strong> |
                    <span style={{
                        color: APP_CONFIG.mode === 'production' ? '#28a745' : '#007bff',
                        fontWeight: 500,
                        marginLeft: '0.5rem'
                    }}>
              {APP_CONFIG.status}
            </span>
                </div>
            </footer>
        </div>
    );
}

export default App;