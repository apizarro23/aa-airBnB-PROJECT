import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/get-all-spots";
const ADD_SPOT = "spots/add";
const DELETE_SPOT = "spots/delete";
const EDIT_SPOT = "spots/edit";
const GET_USER_SPOTS = "spots/get-user-spots";

const getAll = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

const editSpot = (editedSpot) => {
  return {
    type: EDIT_SPOT,
    editedSpot,
  };
};

const getUserSpots = (currentUserSpots) => {
  return {
    type: GET_USER_SPOTS,
    currentUserSpots,
  };
};

//Get all spots
export const getAllSpots = async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(getAll(spots));
    const all = {};
    spots.forEach((spot) => (all[spot.id] = spot));
    return { ...all };
  }
  return {};
};

//Get the current user's spots

export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/your-spots");
  if (response.ok) {
    const allSpots = await response.json();
    dispatch(getUserSpots(allSpots));
    return allSpots;
  }
  return response;
};

//Get a spot detail
export const findASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
    return spot;
  }
  return response;
};

//Create a spot
export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spot),
  });
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }

  return response;
};

//edit a spot
export const spotEdit = (spot) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spot.spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  if (response.ok) {
    const editedSpot = await response.json();
    dispatch(editSpot(editedSpot));
    return editedSpot;
  }
  return response;
};

//delete a spot
export const spotDelete = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    body: JSON.stringify({
      spotId,
    }),
  });

  const res = await response.json();
  dispatch(deleteSpot(spotId));
  return res;
};

const initialState = {};
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.spots.forEach((spot) => (allSpots[spot.id] = spot));
      return allSpots;
    }
    case ADD_SPOT: {
      let newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    case EDIT_SPOT: {
      const newState = { ...state };
      newState[action.editedSpot.id] = action.editedSpot;
      return newState;
    }
    case GET_USER_SPOTS: {
      const newState = {};
      action.currentUserSpots.forEach(spot => newState[spot.id] = spot);
      let allSpots = {...newState};
      return allSpots;
    }
    default:
      return state;
  }
};

export default spotsReducer;
