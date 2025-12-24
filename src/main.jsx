import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import keycloak from './keycloak';

const root = ReactDOM.createRoot(document.getElementById('root'));

keycloak.init({
  onLoad: 'login-required', 
  checkLoginIframe: false,
  pkceMethod: 'S256',      
}).then((authenticated) => {
  
  if (authenticated) {
    console.log("User is Authenticated! 🔓");
  } else {
    console.log("User is NOT Authenticated 🔒");
  }

  root.render(
    <React.StrictMode>
      <App keycloak={keycloak} /> 
    </React.StrictMode>,
  );

}).catch((error) => {
  console.error("Keycloak Init Failed", error);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-bold p-10 text-center">
      <div>
        <h1 className="text-3xl mb-4">Authentication Error ⚠️</h1>
        <p>Could not connect to Keycloak Server. Make sure Docker is running on port 8181/8080.</p>
      </div>
    </div>
  );
});