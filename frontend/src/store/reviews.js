import { csrfFetch } from './csrf';

const GET_SPOT_REVIEWS = 'reviews/GET_SPOT_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'

//ACTION CREATORS
const getReviewsBySpot = (payload) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload
    }
}

const addReview = (payload) => {
    return {
        type: ADD_REVIEW,
        payload
    };
};


//ALL THUNKS BELOW UNTIL REACHIN REDUCER
//GET REVIEWS BY SPOT
export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/spots/${spotId}`);
    if(response.ok) {
        const review = await response.json();
        dispatch(getReviewsBySpot(review));
    }
    return response
}

//CREATE A REVIEW FOR SPOT
export const createReview = review => async dispatch => {
    //INTERPOLATE SPOTID BELOW
    const response = await csrfFetch('/api/reviews/spots/:spotId/newReview', {
        method: "POST",
        body: JSON.stringify(review)
    })
    if (response.ok) {
        const newReview = await response.json();
        dispatch(addReview(newReview));
        return newReview
    }
    return response
}

//REVIEWS REDUCER
const initialState = {};
const reviewsReducer = (state = initialState, action) => {
    switch (action.type){
        case GET_SPOT_REVIEWS: {
            const newState = {};
            action.currentSpotReviews.forEach(review => newState[review.spotId] = review);
            let allReviews = {...newState};
            return allReviews;
        }
        case ADD_REVIEW: {
            let newState = {...state};
            newState[action.review.spotId] = action.review;
            return newState;
        }
    }
}

export default reviewsReducer