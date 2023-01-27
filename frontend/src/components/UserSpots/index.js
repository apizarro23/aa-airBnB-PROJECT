import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserSpots } from "../../store/spots";
import "./userSpots.css";

const UserSpots = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const spotsList = useSelector((state) => Object.values(state.spots));

  const handleClick = (spot) => {
    history.push(`/spots/${spot.id}`);
  };

  useEffect(() => {
    dispatch(getCurrentUserSpots()).then(() => setLoaded(true));
  }, [dispatch]);

  return (
    <div>
      <h2 className="my-spots-div">My Spots</h2>
      <div className="spotsContainer">
        <div className="detailSpot">
          {loaded &&
            spotsList.map((spot) => (
              <div
                className="mySpots"
                key={spot.id}
                onClick={() => handleClick(spot)}
              >
                <div className="spotDetails">
                  <div>{spot.name}</div>
                  <img
                    className="detailImg"
                    src={spot.previewImage}
                    alt={spot.name}
                  ></img>
                  <div className="spot-bottom-div">
                    {spot.city}, {spot.state}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserSpots;
