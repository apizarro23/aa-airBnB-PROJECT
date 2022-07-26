import { csrfFetch } from './csrf'

const GET_ALL_SPOTS = 'spots/getAllSpots'
const GET_DETAILS = 'spots/getDetails'

const getSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      payload: spots
    };
  };
  
  const getSingleSpot = (spot) => {
    return {
      type: GET_DETAILS,
      payload: spot
    };
  };

  export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    if (response.ok) {
      const spots = await response.json();
      dispatch(getSpots(spots.Spots));
      return response
    }
    return response;
  };
  
  export const getDetails = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);
    if (response.ok) {
      const spot = await response.json();
      const result = dispatch(getSingleSpot(spot));
      return result
    }
    return response;
  };

  const spotsReducer = (state = {}, action) => {
    switch(action.type) {
      case GET_ALL_SPOTS: {
        let newState = {...state}
        action.spots.forEach(spot => {
          newState[spot.id] = spot
        })
        newState.orderedSpotsList = [...action.spots.sort((a, b) => a.id - b.id)]
        return newState
      }
      case GET_DETAILS: {
        let newState = {}
        newState[action.spot.id] = action.spot
        const images = action.spot.Images
        newState[action.spot.id].images = {}
        images.forEach((image, i) => {
          newState[action.spot.id].images[i + 1] = image.url
        })
        delete newState[action.spot.id].Images
        return newState
      }
      default:
        return state;
    }
  }
  
  export default spotsReducer