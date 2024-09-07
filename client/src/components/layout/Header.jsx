import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { logout } from '../../services/login';

const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TranscribeAI</Link>
        <ul className="flex space-x-4">
          {state.user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;