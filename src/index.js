import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import statement
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Homepage from './components/Homepage';
import Example from './components/Example';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="/dist/output.css" rel="stylesheet" />
      <title>Image Processing Example</title>
    </head>
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="example" element={<Example />} />
        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
