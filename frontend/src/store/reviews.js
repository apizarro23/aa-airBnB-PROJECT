import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "/reviews/load";
const POST_REVIEWS = "/reviews/post";
const DELETE_REVIEW = "/review/delete";
const LOAD_USER_REVIEWS = "/reviews/user"

const deleteReviewAction = (review) => {
  return {
    type: DELETE_REVIEW,
    review,
  };
};

const createReviewAction = (review) => {
  return {
    type: POST_REVIEWS,
    review,
  };
};

const loadUserReviews = (reviews) => {
  return {
    type: LOAD_USER_REVIEWS,
    reviews
  }
}


const loadReviewAction = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
  };
};

//create review
export const createReviews = (spotId, review) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/spots/${spotId}/newreview`, {
    method: "POST",
    body: JSON.stringify(review),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(createReviewAction(newReview));
    return newReview;
  }

  return response;
};

//get all reviews of a spot
export const loadReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/spots/${spotId}`);

  if (response.ok) {
    const allReviews = await response.json();
    dispatch(loadReviewAction(allReviews));
    return allReviews;
  }

  return response;
};

//get the current user's reviews
export const getUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/users/currentuser/allreviews`);
  if (response.ok) {
    const userReviews = await response.json();
    dispatch(loadUserReviews(userReviews));
  }
  return response;
};

//delete review
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  const deletedReview = await response.json();
  dispatch(deleteReviewAction(reviewId));
  return deletedReview;
};

const initialState = {};
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.review.spotId];
      return newState;
    };
    case POST_REVIEWS: {
      const newState = { ...state };
      newState[action.review] = action.review;
      return newState;
    };
    case LOAD_REVIEWS: {
      const allReviews = {};
      action.reviews.forEach((review) => (allReviews[review.id] = review));
      // let reviews = {...allReviews};
      return allReviews;
    };
    case LOAD_USER_REVIEWS: {
      const newState = {};
      action.reviews.forEach(reviews => newState[reviews.id] = reviews);
      // let allReviews = {...newState};
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;