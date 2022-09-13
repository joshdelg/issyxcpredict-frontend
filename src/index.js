import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './views/Home';
import Predict from './views/Predict';
import Dashboard from './views/Dashboard';
import Scrape from './views/Scrape';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<Home />} />
            <Route path="predict" element={<Predict />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="scrape" element={<Scrape />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
