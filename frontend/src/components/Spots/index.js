import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import "./spots.css";

const SpotsPage = () => {
  const dispatch = useDispatch();
  const spotsList = useSelector((state) => Object.values(state?.spots));
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <>
      <div className="spotsPage">
        <div className="left"></div>
        {spotsList.map((spot) => (
          <Link to={`/spots/${spot?.id}`}>
            <div key={spot.id}>
              <img
                className="spotImg"
                src={spot.previewImage}
                alt={spot.name}
              ></img>
              <h4 className="spotLocation">
                {spot.city}, {spot.state}
              </h4>
              <h3 className="spotName">{spot.name}</h3>
              <p className="spotDetails">{spot.description}</p>
              <p className="spotPrice">${spot.price} night</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SpotsPage;