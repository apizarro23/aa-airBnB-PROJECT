import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignUpFormPage from "./components/SignUpFormPage";
import LoginFormModal from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

// SPOTS CRUD IMPORTS
import SpotDetail from "./components/SpotDetail";
import SpotsPage from "./components/Spots";
import NewSpotForm from "./components/SpotsForm";
import EditSpot from "./components/SpotEdit";
import UserSpots from "./components/UserSpots";

//REVIEWS CRUD IMPORTS
import CreateReview from "./components/SpotDetail/CreateReview";
// import UserReviews from "./components/UserSpots/UserReviews";
import UserReviews from "./components/UserSpots/UserReviews"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          {/* SIGNUP ROUTE */}
          <Route path="/signup">
            <SignUpFormPage />
          </Route>

          {/* LOGIN ROUTE */}
          <Route exact path="/login">
            <LoginFormModal />
          </Route>

          {/* GET ALL SPOTS */}
          <Route exact path="/">
            <SpotsPage />
          </Route>

          {/* CREATE A SPOT */}
          <Route exact path="/spots/create">
            <NewSpotForm />
          </Route>

          {/* GET SPOT BY ID */}
          <Route exact path="/spots/:spotId">
            <SpotDetail />
          </Route>

          {/* EDIT SPOT  */}
          <Route exact path="/spots/:spotId/edit">
            <EditSpot />
          </Route>

          {/* GET SPOT BY USER */}
          <Route exact path="/currentUser/spots">
            <UserSpots />
          </Route>

          {/* CREATE REVIEW */}
          <Route exact path="/spots/:spotId/createReview">
            <CreateReview />
          </Route>
          
          {/* CURRENT USER REVIEWS */}
          <Route exact path="/spots/currentUser/reviews">
            <UserReviews />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;