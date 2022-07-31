// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory, useParams } from "react-router-dom";
// import { getUserReviews, loadReviews } from "../../store/reviews";
// import { deleteReview } from "../../store/reviews";

// function UserReviews() {
//   const history = useHistory();
//   const dispatch = useDispatch();
//   const { spotId } = useParams();
//   const [isLoaded, setIsloaded] = useState(false);
//   const [reviewId, setReviewId] = useState()
//   const reviews = useSelector((state) => {
//     return Object.values(state.reviews);
//   });

//   useEffect(() => {
//     dispatch(getUserReviews()).then(() => setIsloaded(true));
//   }, [dispatch]);

//   const handleDeleteClick = (reviewId) => async (e) => {
//     e.preventDefault();
//     const response = await dispatch(deleteReview(reviewId));
//     if (response) {
//       await dispatch(getUserReviews())
//       history.push(`/spots/currentUser/reviews`);
//     }
//   };

//   return (
//     isLoaded && (
//       <div>
//         <h1>{reviews?.length > 0 ? "My Reviews" : "No Reviews"}</h1>
//         {reviews?.map((review) => (
//         <div key={review.id}>
//           <div>{review.id}</div>
//           <div>{review.ownerId}</div>
//           <div>{review.review}</div>
//           <div>{review.stars}</div>

//           <button onClick={handleDeleteClick(review.id)}>
//             Delete this Review
//           </button>
//         </div>
//         ))}
//       </div>
//     )
//   );
// }

// export default UserReviews;



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUserReviews, deleteReview } from "../../store/reviews";
import './userReviews'

function UsersReviews() {
  const dispatch = useDispatch();
  const history = useHistory();
  // const userReviewsObj = useSelector((state) => state.reviews);
  const userReviews = useSelector((state) => Object.values(state.reviews))
  // console.log(userReviews,'THIS IS THE USER REVIEWS')
  // const userReviews = Object.values(userReviewsObj);
  // const [isLoaded, setIsloaded] = useState(false);

  useEffect(() => {
    dispatch(getUserReviews());
  }, [dispatch]);

  const removeReview = (reviewId) => async (e) => {
    e.preventDefault();
    await dispatch(deleteReview(reviewId))
    await dispatch(getUserReviews())
    console.log(`is this hitting`)
    history.push("/spots/currentUser/reviews");
  };

  if (userReviews.length === 0) {
    return <p>Oh no! No reviews yet.</p>;
  }

  return (
    // isLoaded && (
      (
      <div>
        <h2>My Reviews</h2>
        {userReviews.map((review) => {
          {console.log(review,'THIS IS REVIEW IN JSX!!!')}
          return (
          <div key={review.id} className="ind-review">
            <div className="review-list-rating">
              <i className="fa-solid fa-star"></i>
              <p>{review.stars}</p>
            </div>
            <div className="review-content">{review.review}</div>
            <button onClick={removeReview(review.id)}>Delete Review</button>
          </div>
          )
        })}
      </div>
    )
  );
}

export default UsersReviews;