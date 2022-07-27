import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as spotActions from "../../store/spots";
import "./form.css";

const SpotForm = () => {
  const dispatch = useDispatch();
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  if (submitSuccess) {
    return <Redirect to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let data = {
      address: address,
      city: city,
      state: state,
      country: country,
      previewImage: previewImage,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
    };
    return dispatch(spotActions.createSpot(data))
      .then(async (res) => {
        setSubmitSuccess(true);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <form className='spotForm' onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Name
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
      
        />
      </label>
      <label>
        Address
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          
        />
      </label>
      <label>
        City
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          
        />
      </label>
      <label>
        State
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          
        />
      </label>
      <label>
        Country
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          
        />
      </label>
      <label>
        Latitude
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          
        />
      </label>
      <label>
        Longitude
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          
        />
      </label>
      <label>
        Description
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          
        />
      </label>
      <label>
        Price
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          
        />
        </label>
      <label >
        Image
        <input
          type="text"
          placeholder="img-url"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
        />
      </label>
      <button type="submit">Create Spot</button>
    </form>
  );
};

export default SpotForm;