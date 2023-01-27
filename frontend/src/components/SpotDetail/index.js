import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { spotDelete } from "../../store/spots";
import { loadAllReviewsThunk } from "../../store/reviews";
import "./spotDetail.css";
import { getAllUsers } from "../../store/user";
import Calendar from "react-calendar";
import CreateBooking from "../Bookings/createBookings";
import CreateBookingForm from "../Bookings/createBookings";
// import MapContainer from "../GoogleMaps";

const SpotsDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const spots = useSelector((state) => state.spots);
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => Object.values(state.reviews));
  const users = useSelector((state) => state.users);
  const [isLoaded, setIsLoaded] = useState(false);
  const spotsString = JSON.stringify(spots);
  const reviewsString = JSON.stringify(reviews);
  const usersString = JSON.stringify(users);
  const user = useSelector((state) => Object.values(state.users));

  useEffect(() => {
    getAllSpots(dispatch);
    setIsLoaded(true);
    if (isLoaded && spots && spots[spotId] === undefined) {
      history.push("/");
    }
  }, [dispatch, spotsString]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch, usersString]);

  useEffect(() => {
    dispatch(loadAllReviewsThunk());
  }, [dispatch, reviewsString]);

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
    history.push(`/spots/${spotId}/createReview`);
  };

  let spot = spots[spotId];
  console.log(spot)
  const allReviewsForThisSpot = reviews.filter((review) => {
    return review.spotId === spotId;
  });
  let allStars = 0;
  (allReviewsForThisSpot || []).forEach((review) => {
    allStars += review.stars;
  });
  const avgStarRating = allStars / allReviewsForThisSpot.length;

  const userReviewForThisSpot = reviews.filter((review) => {
    if (!sessionUser) {
      return [];
    } else {
      return review.userId === sessionUser.id && review.spotId === spotId;
    }
  });

  const fetchNameById = (userId) => {
    if (!users[userId]) {
      return "";
    } else {
      const firstName = users[userId].firstName;
      return firstName;
    }
  };

  const spotsUser = user.filter((use) => {
    return use.id === spot?.ownerId;
  });

  return (
    spot && (
      <>
        <div className="spotDetailPage">
          <div className="top">
            <div className="topText">
              <div className="detailName">{spot.name} </div>
              <div className="outerBox">
                <div className="avgStarRating">
                  <div className="star">{<i className="fas fa-star"></i>}</div>
                  <div className="avgRating">
                    {(avgStarRating || 0).toFixed(2)}{" "}
                  </div>
                  <div className="circle">
                    <i className="fas fa-circle"></i>{" "}
                  </div>
                  <div className="reviewCount">
                    {allReviewsForThisSpot.length} Review(s)
                  </div>
                  <div className="circle">
                    <i className="fas fa-circle"></i>{" "}
                  </div>
                  <div className="detailLocation">
                    {spot.city}, {spot.state}, {spot.country}
                  </div>
                </div>
                {sessionUser && sessionUser.id === spot.ownerId && (
                  <div className="editAndDeleteButtons">
                    <button className="editButton" onClick={handleEditClick}>
                      Edit
                    </button>
                    <button className="deleteButton" onClick={handleDelete}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <img
              className="detailImg"
              src={spot.previewImage}
              alt={spot.name}
            ></img>
          </div>
          <div className="hosted-container">
            <div>Entire home hosted by {spotsUser[0]?.firstName}</div>
          </div>
          <div className="bottomContainer">
            <div className="detailDescription">
              <div className="self">
                <i className="fa-solid fa-door-open"></i> Self check-in
              </div>
              <div className="check">Check yourself in with the lockbox.</div>
              <div className="superhost">
                <i className="fa-solid fa-award"></i> {spotsUser[0]?.firstName}{" "}
                is a Superhost
              </div>
              <div className="experience">
                Superhosts are experienced, highly rated hosts who are committed
                to providing great stays for guests.
              </div>
              <div className="cancel">
                <i className="fa-regular fa-calendar"></i> Free cancellation for
                48 hours.
              </div>
              <div className="description">{spot.description}</div>
            </div>
            <div>
              <CreateBookingForm
                spot={spot}
                star={avgStarRating}
                review={allReviewsForThisSpot}
              />
            </div>
          </div>
          {/* <div className="googleMaps">
            <div className="location" >Location</div>
            <MapContainer lng={spot?.lng} lat={spot?.lat}/>
          </div> */}
          <div className="spotsReviews">
            <div className="reviewStars">
              <div className="starIcon">{<i className="fas fa-star"></i>}</div>
              <div className="avgRatingBottom">
                {(avgStarRating || 0).toFixed(2)}{" "}
              </div>
              <div className="circleBottom">
                <i className="fas fa-circle"></i>{" "}
              </div>
              <div className="reviewCountBottom">
                {allReviewsForThisSpot.length} Review(s)
              </div>
              <div>
                {!userReviewForThisSpot.length && (
                  <button className="reviewButton" onClick={handleCreateReview}>
                    Create Review
                  </button>
                )}
              </div>
            </div>

            {allReviewsForThisSpot.map((review) => (
              <div key={review.id}>
                <div className="eachReview">
                  <div className="reviewName">
                    Name: {fetchNameById(review.userId)}
                  </div>
                  <div className="reviewContent">Review: {review.review}</div>
                  <div className="eachReviewStars">
                    Stars: {review.stars}
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  );
};

export default SpotsDetail;
