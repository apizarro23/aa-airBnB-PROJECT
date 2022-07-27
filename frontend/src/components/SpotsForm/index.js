import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import {createSpot} from "../../store/spots";
import "./form.css";

const SpotForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState("")
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState([]);

  if (!sessionUser) {
    alert("You must log in to create a spot")
    return <Redirect to="/" />
  }
 

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateErrors = [];
    if (name.length < 1) validateErrors.push('Please include a title for your listing.');
    if (city.length < 1) validateErrors.push('Please include a city.');
    if (description.length < 1) validateErrors.push('Please include a description for your listing.');
    if (address.length < 1 || city.length < 1 || country.length < 1 || state.length < 1) validateErrors.push('Please include a full address.');
    if (lat.length < 1 || lng.length < 1) validateErrors.push('Please include a latitude and longitude.');
    if (price.length < 1) {
        validateErrors.push('Please include a price.')
    } else if (price.length > 0) {
        if (Number(price) === 0) {
            validateErrors.push('Price must be more that $0')
        }
    }
    if (validateErrors.length > 0) {
        setErrors(validateErrors);
        return;
    }


    let newSpot = {
      name: name,
      address: address,
      city: city,
      state: state,
      country: country,
      previewImage: previewImage,
      lat: lat,
      lng: lng,
      description: description,
      price: price,
    };

    history.push("/")
    return dispatch(createSpot(newSpot))
  };

  return (
    <form onSubmit={handleSubmit} className='spotForm'>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Address:
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label>
        City:
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label>
        State:
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label>
        Country:
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label >
        Preview Image: 
        <input
          type="text"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />
      </label>
      <label>
        Lat:
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        />
      </label>
      <label>
        Lng:
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Price:
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create a new Spot</button>
    </form>
  );
};

export default SpotForm;