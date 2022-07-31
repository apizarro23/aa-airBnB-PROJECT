import { csrfFetch } from "./csrf";

// const GET_SPOT = "spots/get-spot";
const GET_ALL_SPOTS = "spots/get-all-spots"
const GET_USER_SPOTS = "spots/get-user-spots"
const CREATE = "spots/add"
const EDIT_SPOT = "spots/edit"
const DELETE_SPOT = "spots/delete"

//ACTION CREATORS
// const getSpot = (spot) => {
//   return {
//     type: GET_SPOT,
//     spot,
//   };
// };

const getAll = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const getUserSpots = (currentUserSpots) => {
  return {
    type: GET_USER_SPOTS,
    currentUserSpots,
  };
};

const addSpot = (spot) => {
  return {
    type: CREATE,
    spot
  };
};

const editSpot = (editedSpot) => {
  return {
    type: EDIT_SPOT,
    editedSpot,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};


//ALL THUNKS BELOW UNTIL REACHING REDUCER
//GET ALL SPOTS
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

//GET SPOT BY ID
export const findASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
    return spot
  }
  return response;
};

//GET SPOT BY CURRENT USER
export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/your-spots");
  if (response.ok) {
    const allSpots = await response.json();
    dispatch(getUserSpots(allSpots));
    return allSpots;
  }
  return response;
};

//CREATE A SPOT
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

//EDIT A SPOT
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

//DELETE A SPOT
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

//SPOT REDUCER
const initialState = {};
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.spots.forEach((spot) => (allSpots[spot.id] = spot));
      return allSpots;
    }
    case GET_USER_SPOTS: {
      const newState = {};
      action.currentUserSpots.forEach(spot => newState[spot.id] = spot);
      let allSpots = {...newState};
      return allSpots;
    }
    case CREATE: {
      let newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case EDIT_SPOT: {
      const newState = { ...state };
      newState[action.editedSpot.id] = action.editedSpot;
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.res];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;