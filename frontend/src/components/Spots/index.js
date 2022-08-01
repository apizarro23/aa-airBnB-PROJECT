import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import "./spots.css";

const SpotsPage = () => {
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const spotsList = useSelector((state) => Object.values(state.spots));
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch, JSON.stringify(spotsList)]);

  return (
    <div className="spotsPage">
      {spotsList &&
        spotsList.map((spot) => (
          <div key={spot.id}>
            <NavLink to={`/spots/${spot.id}`}>
              <div className="eachSpot" key={spot.id}>
                <img
                  className="spotImg"
                  src={spot.previewImage}
                  alt={spot.name}
                ></img>
                <h4 className="spotLocation">
                  {spot.city}, {spot.state}
                </h4>
                <h3 className="spotName">{spot.name}</h3>
                <p className="spotAddress">{spot.address}</p>
                <p className="spotDetails">{spot.description}</p>
                <p className="spotPrice"> ${spot.price} night</p>
              </div>
            </NavLink>
          </div>
        ))}
    </div>
  );
};

export default SpotsPage;