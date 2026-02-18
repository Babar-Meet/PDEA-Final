// src/main.jsx

// Auto-upgrade all WebSocket connections to wss on HTTPS
const OriginalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
  if (typeof url === 'string' && url.startsWith('ws://') && window.location.protocol === 'https:') {
    console.log(`Upgrading WebSocket: ${url} → ${url.replace('ws://', 'wss://')}`);
    url = url.replace('ws://', 'wss://');
  }
  return new OriginalWebSocket(url, protocols);
};

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
