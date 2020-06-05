import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

// import { Container } from './styles';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path='/' exact component={Home} />
      <Route path='/cadastrar' component={CreatePoint} />
    </BrowserRouter>
  );
};

export default Routes;
