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

  const validations = () => {
    const errors = [];
    if (!address) errors.push("Please enter an address");
    if (!city) errors.push("Please enter a city");
    if (!state) errors.push("Please enter a state");
    if (!country) errors.push("Please enter a country");
    if (!previewImage) errors.push("Please include a preview image");
    if (name.length < 2)
      errors.push("Please enter a name with a length greater than 2");
    if (!description) errors.push("Please include a description");
    if (!previewImage) errors.push("Please include a preview image!");
    if (name.length > 25)
      errors.push("Please include a name with a length that is less than 25.");
    return errors;
  };

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
    <div className="formContainer">
      <div>
        <h2 className="createSpotText">Create a Spot</h2>
      </div>
      <form className="spotForm" onSubmit={handleSubmit}>
        {errors ?? (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <div>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City: </label>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country: </label>
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Latitude:</label>
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
          />
          </div>
        <div>
          <label>Longitude</label>
        <input
          type="text"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
          />
          </div>
        <div>
          <label>Description:</label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          />
          </div>
        <div>
          <label>Price:</label>
        <input
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          />
          </div>
        <div>
          <label>Image:</label>
          <input
            type="text"
            placeholder="img-url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            required
          />
        </div>
        <div className="buttonContainer">
          <button className="createSpot" type="submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpotForm;
