import { Routes } from '@generouted/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '~/main.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
);
