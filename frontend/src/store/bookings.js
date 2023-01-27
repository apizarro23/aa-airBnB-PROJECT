import { csrfFetch } from "./csrf";

const GET_ALL_BOOKINGS = "bookings/get-all";
const ADD_BOOKINGS = "bookings/add";
const DELETE_BOOKING = "bookings/delete";
const EDIT_BOOKING = "bookings/edit";
const GET_CURRENT_USER_BOOKING = "bookings/current"

const getCurrentBookingAction = (user) => {
  return {
    type: GET_CURRENT_USER_BOOKING,
    payload: user
  }
}

const getAllBookingsAction = (bookings) => {
  return {
    type: GET_ALL_BOOKINGS,
    bookings,
  };
};

const addBookingsAction = (booking) => {
  return {
    type: ADD_BOOKINGS,
    booking
  };
};

const editBookingsAction = (booking) => {
  return {
    type: EDIT_BOOKING,
    booking,
  };
};

const deleteBookingsAction = (bookingId) => {
  return {
    type: DELETE_BOOKING,
    bookingId,
  };
};

// //get current user booking
export const getCurrentUserBooking = () => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/current-user-bookings`);
  if (response.ok) {
    const booking = await response.json();
    dispatch(getCurrentBookingAction(booking))
  }
}

//get all bookings
export const getAllBookings = () => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings`);
  if (response.ok) {
    const bookings = await response.json();
    dispatch(getAllBookingsAction(bookings));
    const all = {};
    bookings.forEach((booking) => (all[booking.id] = booking));
    return { ...all };
  }
  return {};
};

//create a booking
export const createBooking = (id, booking) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${id}/`, {
    method: "POST",
    body: JSON.stringify(booking),
  });
  if (response.ok) {
    const newBooking = await response.json();
    dispatch(addBookingsAction(newBooking));
    return newBooking;
  }

  return response;
};

//edit a booking
export const editBooking = (booking) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${booking.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (response.ok) {
    const editedBooking = await response.json();
    dispatch(editBookingsAction(editedBooking));
    return editedBooking;
  }
  return response;
};

//delete a booking
export const deleteBooking = (bookingId) => async (dispatch) => {
  const response = await csrfFetch(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  const res = await response.json();
  dispatch(deleteBookingsAction(bookingId));
  return res;
};

const initialState = {};
const bookingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_USER_BOOKING: {
      let newState = {}
      newState = action.payload;
      return newState;
    }
    case DELETE_BOOKING: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    case ADD_BOOKINGS: {
      const newState = { ...state };
      newState[action.booking.id] = action.booking;
      return newState;
    }
    case GET_ALL_BOOKINGS: {
      const allBookings = {};
      action.bookings.forEach((booking) => (allBookings[booking.id] = booking));
      let bookings = { ...allBookings };
      return bookings;
    }
    case EDIT_BOOKING: {
        const newState = { ...state };
        newState[action.booking.id] = action.booking;
        return newState;
      }
    default:
      return state;
  }
};

export default bookingsReducer;
