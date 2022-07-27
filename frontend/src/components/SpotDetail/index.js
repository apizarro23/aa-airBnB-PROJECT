import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { findASpot } from "../../store/spots";
import "./SpotsDetail.css"

const SpotsDetail = () => {
  let { spotId } = useParams();
  spotId = Number(spotId);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(findASpot(spotId));
  }, [dispatch, spotId]);

  return (
    <div key={spot.id}>
      <h4 className="detailName">{spot.name}</h4>
      <img className="detailImg" src={spot.previewImage} alt={spot.name}></img>
      <h3 className="detailLocation">
        {spot.city}, {spot.state}
      </h3>
      <p className="detailDescription">{spot.description}</p>
      <p className="detailPrice">${spot.price} night</p>
    </div>
  );
};

export default SpotsDetail;