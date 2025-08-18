import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">SkillSwap</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <Link to="/create" className="px-3 py-1 border rounded">Create</Link>
              <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
           ) : (
            <>
              <Link to="/login" className="px-3 py-1">Login</Link>
              <Link to="/register" className="px-3 py-1 border rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
// This component renders the navigation bar for the SkillSwap application.
// It includes links to the home page, login, register, and create skill pages.
// If a user is logged in, it displays their name and a logout button.
// The navigation bar is responsive and adapts to the user's authentication state.
// The `useAuth` hook is used to access the current user and authentication functions.

// The `useNavigate` hook from React Router is used to programmatically navigate after logout.
// The navigation bar is styled with Tailwind CSS classes for a clean and modern look.
