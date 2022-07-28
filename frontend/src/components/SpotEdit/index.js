import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import { useHistory } from "react-router-dom";

const EditSpot = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = Number(spotId);
  const spot = useSelector((state) => state.spots[spotId]);
  const [name, setName] = useState(spot?.name);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [price, setPrice] = useState(spot?.price);
  const [previewImage, setPreviewImage] = useState(spot?.previewImage);
  const [errors, setErrors] = useState([]);

  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateCountry = (e) => setCountry(e.target.value);
  const updateLat = (e) => setLat(e.target.value);
  const updateLng = (e) => setLng(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePreviewImage = (e) => setPreviewImage(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    let data = {
      address,
      city,
      state,
      country,
      previewImage,
      lat,
      lng,
      name,
      description,
      price,
      spotId
    };
    
    return dispatch(spotActions.spotEdit(data))
    .then(() => {
      history.push(`/spots/${spot.id}`)
      // <Redirect to={`/spots/${}`} />
    })
    // .catch(async (res) => {
    //   const data = await res.json();
    //   if (data && data.errors) setErrors(data.errors);
    // });
    
  };

  return (
    <form className="editSpot" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Name
        <input
          type="text"
          placeholder="Spot name"
          value={name}
          onChange={updateName}
        />
      </label>
      <label>
        Address
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={updateAddress}
        />
      </label>
      <label>
        City
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={updateCity}
        />
      </label>
      <label>
        State
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={updateState}
        />
      </label>
      <label>
        Country
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={updateCountry}
        />
      </label>
      <label>
        Lat
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={updateLat}
        />
      </label>
      <label>
        Lng
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={updateLng}
        />
      </label>
      <label>
        Description
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={updateDescription}
        />
      </label>
      <label>
        Price
        <input
          type="text"
          value={price}
          placeholder="Price"
          onChange={updatePrice}
        />
        <label>
          Image
          <input
            type="text"
            placeholder="img-url"
            value={previewImage}
            onChange={updatePreviewImage}
          />
        </label>
      </label>
      <button type="submit">Confirm Edit</button>
    </form>
  );
};

export default EditSpot;