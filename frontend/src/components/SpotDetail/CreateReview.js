import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, useParams, useHistory } from "react-router-dom";
// import * as reviewActions from "../../store/reviews";
import { createReviews } from "../../store/reviews";
import './SpotsDetail.css'


const CreateReview = () => {
  const history = useHistory();
    const dispatch = useDispatch();
    let { spotId } = useParams();
    spotId = Number(spotId);
  
    const [reviewMessage, setReviewMessage] = useState("");
    const [stars, setStars] = useState("");
    const [errors, setErrors] = useState([]);
    const [submitSuccess, setSubmitSuccess] = useState(false);
  
    if (submitSuccess) {
      return <Redirect to={`/spots/${spotId}`} />;
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      let review = {
        review: reviewMessage,
        stars: stars,
      };
      
      // history.push(`/spots/${spotId}`)

      return dispatch(createReviews(spotId, review))
        .then(async (res) => {
          setSubmitSuccess(true);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    };
  
    return (
      <form className="spotsReview" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Message:
          <input
            type="text"
            placeholder="ENTER REVIEW HERE"
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            required
          />
        </label>
        <label>
          Stars:
          <input
            type="text"
            placeholder="RATE FROM 1 - 5"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Review</button>
      </form>
    );
  };
  
  export default CreateReview;