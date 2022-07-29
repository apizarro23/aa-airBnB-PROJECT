import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import {createReview} from '../../store/review'
import './createReview.css'


const CreateReview = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    let { id } = useParams()
    id = Number(id)
    const user = useSelector((state) => state.session.user)

    const [review, setReview] = useState('')
    const [stars, setStars] = useState('')
    const [errors, setErrors] = useState([])

    // if (!user) return <Redirect to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors([])

        const newReview = {
            review,
            stars
        }

        history.push(`/spots/${id}`)
        //history.push(`/`)
        return dispatch(createReview(newReview, id))
    }


    return (
        <form onSubmit={handleSubmit} className='createReview'>
            <ul>
                {errors.map((error, id) => (
                    <li key={id}>{error}</li>
                ))}
            </ul>
            <label>
                Leave Your Review Here:
                <input
                type="text"
                placeholder='Review'
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                />
            </label>
            <label>
                Stars:
                <input
                type="text"
                placeholder='Stars'
                value={stars}
                onChange={(e) => setStars(e.target.value)}
                required
                />
            </label>

            <button type="submit">Create Review</button>
        </form>
    )
}

export default CreateReview