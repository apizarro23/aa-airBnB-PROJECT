import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {deleteBooking, getCurrentUserBooking} from "../../store/bookings"

function DeleteComment({ booking, onClick }) {
  let dispatch = useDispatch();
  let history = useHistory();

  const onDelete = (e) => {
    e.preventDefault();
    dispatch(deleteBooking(booking.id));
    dispatch(getCurrentUserBooking())
    onClick();
  };

  return (
    <div className="delete-post">
      <div className="delete-head">
        <h3 className="delete-top-modal">Delete Booking?</h3>
        <div className="confirmation-delete-msg">
          Are you sure you want to delete this Booking?
        </div>
      </div>
      <div className="delete-btns-outer">
        <div className="delete-option" onClick={onClick}>
          Cancel
        </div>
        <div className="delete-option" onClick={onDelete}>
          Delete
        </div>
      </div>
    </div>
  );
}

export default DeleteComment;
