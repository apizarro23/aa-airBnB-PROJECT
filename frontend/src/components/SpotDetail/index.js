import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//SPOTS CRUD MIGRATION
import { findASpot } from "../../store/spots";
import { spotDelete } from "../../store/spots";
import "./SpotsDetail.css";

//REVIEWS CRUD MIGRATION
import getSpotReviews from "../../store/reviews";
import SpotReviews from "./spotReviews";

const SpotsDetail = () => {
  const history = useHistory();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => Object.values(state.reviews));

  const spots = useSelector((state) => state.spots);
  const spotsString = JSON.stringify(spots);
  const reviewsString = JSON.stringify(reviews);
  // console.log(sessionUser, 'SESSION USER!!!!!!!')
  // console.log(sessionUser.user, 'THIS IS THE ACTIVE USER.......')
  // console.log(spot, 'THIS IS THE SPOT')
  
  useEffect(() => {
    if (!spot) {
      dispatch(findASpot(spotId))
    }
  }, [dispatch, spotId, spot]);

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(spotDelete(spotId));
    history.push("/");
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    history.push(`/spots/${spotId}/edit`);
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    history.push(`/spots/${spotId}`);
  };


  return (
    spot && (

      <>
      <div>
        <h4 className="detailName">{spot.name}</h4>
        <img
          className="detailImg"
          src={spot.previewImage}
          alt={spot.name}
          ></img>
        <h3 className="detailLocation">
          {spot.city}, {spot.state}
        </h3>
        <p className="detailDescription">{spot.description}</p>
        <p className="detailPrice">${spot.price} night</p>

        {sessionUser &&
          sessionUser.id === spot.ownerId && (
            <div>
              <button onClick={handleDelete}>Delete Spot</button>
              <button onClick={handleEditClick}>Edit Spot</button>
            </div>
          )}
      </div>
        <div>
            <SpotReviews spotId={spotId}/>
        </div>
    </>
  ) 
  );
};

export default SpotsDetail;