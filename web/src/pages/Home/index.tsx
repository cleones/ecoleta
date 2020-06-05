import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div id='page-home'>
      <div className='content'>
        <header>
          <img src={logo} alt='Ecoleta' />
        </header>
        <main>
          <h1>Seu marketplace de coleta de residuoas. </h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>
          <Link to='/cadastrar'>
            <span>
              <FiLogIn />
            </span>
            <strong>Cadaster um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
