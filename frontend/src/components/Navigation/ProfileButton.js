import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./Navigation.css";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = () => {
      setShowMenu(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <div className="button">
        <button className="navBar" onClick={openMenu}>
          <i className="fas fa-bars nav_bars_icon"></i>
          <i className="fas fa-user-circle user_icon"></i>
        </button>
        {showMenu && (
          <div id="menu">
            <Link to="/spots/create" id="dropdown1">
              Host your home
            </Link>
            <Link to="/currentUser/spots" id="dropdown2">My Spots</Link>
            <Link to="/spots/currentUser/reviews" id="dropdown3">My Reviews</Link>
            <div onClick={logout} id="dropdown4">
              Log out
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
