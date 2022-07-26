import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { getAllSpots, getSpotDetails } from "../../store/spots"
import Card from "../Cards"
import './SpotsCards.css'

function SpotCards() {
  const spots = useSelector(state => state.spots.orderedSpotsList)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch])

  return (
    <div className="spots-cards-container">
      {spots?.map(spot => (
        <Card key={spot.id} spot={spot} />
      ))}
    </div>
  )
}

export default SpotCards