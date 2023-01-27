import React, { useEffect, useState } from "react";
import { useParams, useHistory, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllBookings } from "../../store/bookings";
import "./bookingPage.css";

const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const bookings = useSelector((state) => Object.values(state.bookings));
  const booking = bookings.find((booking) => booking.id === Number(bookingId));
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(getAllBookings());
    setIsLoaded(true)
    if (isLoaded && booking === undefined) {
        history.push("/")
    }
  }, [dispatch]);

  return (
    <div className="left-container">
      <div className="congrats">Your reservation is confirmed</div>
      <div className="book-city">You're going to {booking?.Spot?.city}!</div>
      <img className="bookingImg" src={booking?.Spot?.previewImage}></img>
      <div className="bookingName">{booking?.Spot?.name}</div>
      <div className="dates">
        <div className="start">Start Date: {booking?.startDate}</div>
        <div className="end">End Date: {booking?.endDate}</div>
      </div>
      <div className="checkout-div">
      <div className="check-in">Check in time is 4PM - 9 PM</div>
      <div className="checkout-time">Check out 11 AM</div>
      </div>

      <div className="link">
      <NavLink className="view" to={`/currentUser/bookings`}>View your other bookings here!</NavLink>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
