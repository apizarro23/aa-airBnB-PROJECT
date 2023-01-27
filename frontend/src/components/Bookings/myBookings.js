import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserBooking } from "../../store/bookings";
import { NavLink } from "react-router-dom";
import "./myBookings.css";
import DeleteBookingModal from ".";

const MyBookings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const bookings = useSelector((state) => Object.values(state?.bookings));

  useEffect(() => {
    dispatch(getCurrentUserBooking());
  }, [dispatch, JSON.stringify(bookings)]);

  return (
    <div className="main-container">
      <div className="trips">Trips</div>
      <div className="upcoming">Upcoming Reservations</div>
      {bookings?.map((booking) => {
        return (
          <div key={booking.id} className="each-booking">
            <div className="booking-name">{booking.Spot.name}</div>
            <div className="booking-info">
              <NavLink className="image-div" to={`/spots/${booking?.Spot?.id}`}>
              <div className="spot-info-div">
              <div className="start-date">Start Date: {booking?.startDate}</div>
              <div className="end-date">End Date: {booking?.endDate}</div>
                <div>{booking.Spot.address}</div>
                <div>
                {booking.Spot.city}, {booking.Spot.country}
                </div>
              </div>
                <img
                  className="booking-preview"
                  src={booking.Spot.previewImage}
                ></img>
              </NavLink>
            </div>
            <div className="delete-button">
              <DeleteBookingModal booking={booking} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
