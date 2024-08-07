import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Orders from './components/Orders';
import Payment from './components/Payment';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;