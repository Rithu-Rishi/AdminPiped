import React from 'react';
import { HashRouter as Router } from "react-router-dom";
import ScrollToTop from "./pages/ScrollToTop";
import AppRouter from './App.router';


const App = () => {

  return (
    <Router>
      <ScrollToTop />
      <AppRouter />
    </Router>
  );
}

export default App;
