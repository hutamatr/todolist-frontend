import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CgMenuRight, CgClose } from 'react-icons/cg';

import ProfilePicture from './ProfilePicture';
import useAuth from '../../hooks/useAuth';

import todoIcon from '../../assets/images/todo-list-icon.webp';

const Navigation = () => {
  const [viewMenu, setMenuView] = useState(false);

  const { isAuthenticated, logout } = useAuth();

  // const menuIsActive = ({ isActive }) => (isActive ? '' : '');

  const menuViewHandler = () => setMenuView((prevState) => !prevState);

  const logoutHandler = () => logout();

  return (
    <nav className="relative z-[9999] mx-auto flex max-w-5xl flex-row items-center justify-between bg-white p-4 sm:static">
      <Link to={'/'} replace={true} className="flex items-center gap-x-3">
        <img src={todoIcon} alt="" className="w-10" />
      </Link>
      <div className="flex flex-row gap-x-6">
        <button className="sm:hidden" onClick={menuViewHandler}>
          {viewMenu ? (
            <CgClose className="text-xl" />
          ) : (
            <CgMenuRight className="text-xl" />
          )}
        </button>
      </div>
      <ul
        className={`absolute top-16 flex w-[35%] flex-col items-start justify-center gap-y-4 rounded-md bg-white p-4 text-center text-sm font-semibold text-neutral-500 shadow-md duration-500 sm:static sm:top-0 sm:h-0 sm:w-auto sm:translate-x-0 sm:flex-row sm:items-center sm:gap-x-8 sm:bg-transparent sm:py-0 sm:shadow-none ${
          viewMenu ? 'right-4' : '-right-full'
        }`}
      >
        <ProfilePicture classSection={'block sm:hidden'} />
        {isAuthenticated && (
          <li>
            <NavLink to={'dashboard'}>Dashboard</NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to={'category'}>Category</NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink to={'profile'}>Profile</NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <NavLink
              to={'/login'}
              replace
              onClick={logoutHandler}
              className="text-red-100"
            >
              Logout
            </NavLink>
          </li>
        )}
        <ProfilePicture classSection={'hidden sm:block'} />
      </ul>
    </nav>
  );
};

export default Navigation;
