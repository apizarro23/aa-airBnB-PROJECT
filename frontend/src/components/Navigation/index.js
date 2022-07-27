import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
      <div>
        <ProfileButton user={sessionUser} />
      </div>
      </>
    );
  } else {
    sessionLinks = (
      <>
      <div id='nav_right'>
        <div id='loginButton'> <LoginFormModal /></div>
        <div id='signUp'><NavLink to="/signup">Sign Up</NavLink> </div>
      </div>
      </>
    );
  }

  return (
    <nav>
    <div id="home">
        <div id='logo'>
            <NavLink exact to="/">
                <img src="https://1000logos.net/wp-content/uploads/2017/08/Airbnb-logo.jpg"></img>
            </NavLink>
        </div>
  
        {isLoaded && sessionLinks}
    </div >


</nav >
    
  );
}

export default Navigation;