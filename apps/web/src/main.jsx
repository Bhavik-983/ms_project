import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <GoogleOAuthProvider clientId="662759170992-6fikdb9f01b3iidilqon884vfleikcf3.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </Provider>
);
