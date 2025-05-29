import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  // Ingen root här, kör inte React
  console.log("Ingen React-root, ingen rendering.");
}

