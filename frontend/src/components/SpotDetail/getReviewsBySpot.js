import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSpotReviews } from '../../store/reviews';

import CreateReview from './CreateReview'

import { Link, useParams } from 'react-router-dom'

const reviewsBySpotId = ({id}) => {
    const dispatch = useDispatch();
    
    const review = useSelector((state) => Object.values(state.reviewsInReducer));

    useEffect(() => {
        dispatch(getSpotReviews(id));
    }, [dispatch])

    return (
        <div className='all-reviews-div'>
          <h1>Your Reviews</h1>
          {reviewsVariable.map((reviewState, i) => {
  
            return (
              <div>
              <p className='stars'>{`${reviewState.User.firstName} ${reviewState.User.lastName}`}</p>
              <p className='user'>{`${reviewState.stars} stars`}</p>
              <p className='actual-review'>{`${reviewState.review}`}</p>
              </div>
            )
          })
          }
          <div>
          <CreateReview id={id}/>
          </div>
        </div>
      )
  
  
  };
  
  export default ReviewsBySpotId;