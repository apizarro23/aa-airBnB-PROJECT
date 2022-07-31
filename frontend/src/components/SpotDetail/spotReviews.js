import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadReviews } from '../../store/reviews';
import CreateReview from './createReview';

const SpotReviews = ({spotId}) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews));
  // console.log(reviews, 'THIS IS REVIEWS!!!!!')

  useEffect(() => {
      dispatch(loadReviews(spotId));
  }, [dispatch, spotId])

    return (
      <div className='all-reviews-div'>
        <h1>Your Reviews</h1>
        {reviews.map((reviewState, i) => {
         
          return (
            <div key={reviewState.id}>
            {/* <p className='name'>{`${reviewState.User.firstName} ${reviewState.User.lastName}`}</p> */}
            <p className='stars'>{`${reviewState.stars} stars`}</p>
            <p className='review'>{`${reviewState.review}`}</p>
            </div>
          )
        })
        }
        <div>
        <CreateReview id={spotId}/>
        </div>
      </div>
    )


};

export default SpotReviews;