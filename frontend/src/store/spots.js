
import { csrfFetch } from "./csrf";

const GET_SPOT = "spots/get-spot";
const GET_ALL_SPOTS = "spots/get-all-spots";
const ADD = "spots/add"

const getAll = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot,
  };
};

const addSpot = (spot) => {
  return {
    type: ADD,
    spot
  }
}

//Get all spots
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(getAll(spots));
    const all = {};
    spots.forEach((spot) => (all[spot.id] = spot));
    return { ...all };
  }
};

//Get a spot detail
export const findASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(getSpot(spot));
  }
  return response;
};

//Create a spot
export const createSpot = spot => async dispatch => {
  const response = await csrfFetch('/api/spots', {
    method: "POST",
    body: JSON.stringify(spot)
  })
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }

  return response
}

const initialState = {};
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.spots.forEach((spot) => (allSpots[spot.id] = spot));
      return { ...allSpots, ...state };
    }
    case GET_SPOT: {
      const spot = action.spot;
      return { ...spot, ...state };
    }
    case ADD: {
      let newState = {...state};
      newState[action.spot.id] = action.spot;
      return newState;

    }
    default:
      return state;
  }
};

export default spotsReducer;