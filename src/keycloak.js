import Keycloak from "keycloak-js";

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8181/';

const keycloak = new Keycloak({
  url: AUTH_URL, 
  realm: "fitness-app",  
  clientId: "fitness-frontend" 
});

export default keycloak;