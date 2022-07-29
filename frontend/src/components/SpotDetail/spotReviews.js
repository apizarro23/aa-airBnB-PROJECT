// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import { getSpotReviews } from '../../store/reviews';

// import CreateReview from './createReview'

// import { Link, useParams } from 'react-router-dom'

// const reviewsBySpotId = ({id}) => {
//     const dispatch = useDispatch();
    
//     const review = useSelector((state) => Object.values(state.reviewsInReducer));

//     useEffect(() => {
//         dispatch(getSpotReviews(id));
//     }, [dispatch])

//     return (
//         <div className='all-reviews-div'>
//           <h1>Your Reviews</h1>
//           {reviewsVariable.map((reviewState, i) => {
  
//             return (
//               <div>
//               <p className='stars'>{`${reviewState.User.firstName} ${reviewState.User.lastName}`}</p>
//               <p className='user'>{`${reviewState.stars} stars`}</p>
//               <p className='actual-review'>{`${reviewState.review}`}</p>
//               </div>
//             )
//           })
//           }
//           <div>
//           <CreateReview id={id}/>
//           </div>
//         </div>
//       )
  
  
//   };
  
//   export default ReviewsBySpotId;


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
            <div>
            <p className='name'>{`${reviewState.User.firstName} ${reviewState.User.lastName}`}</p>
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