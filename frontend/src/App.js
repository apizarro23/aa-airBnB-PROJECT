import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormModal from "./components/LoginFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotDetail from "./components/SpotDetail";
import SpotsPage from "./components/Spots";
import NewSpotForm from "./components/SpotsForm";
import EditSpot from "./components/SpotEdit";
import UserSpots from "./components/UserSpots";
import CreateReviews from "./components/SpotDetail/createReview";
import UserReviews from "./components/UserSpots/userReviews";

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
          <Route exact path="/">
            <SpotsPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/login">
            <LoginFormModal />
          </Route>
          <Route exact path="/spots/create">
            <NewSpotForm />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <EditSpot />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotDetail />
          </Route>
          <Route exact path="/currentUser/spots">
            <UserSpots />
          </Route>
          <Route exact path="/spots/currentUser/reviews">
            <UserReviews />
          </Route>
          <Route exact path="/spots/:spotId/createReview">
            <CreateReviews />
          </Route>
          <Route path="*">
            404 Page Not Found 
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
