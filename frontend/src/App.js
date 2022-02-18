import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./component/register/register";
import Login from "./component/login/login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({ lng, lat });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      long: newPlace.lng,
      lat: newPlace.lat,
    };

    try {
      const res = await axios.post("pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <>
      <Map
        initialViewState={{
          longitude: 90.399452,
          latitude: 23.777176,
          zoom: 4,
        }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{
          width: "100vw",
          height: "100vh",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
      >
        {pins.map((p) => {
          return (
            <div key={p._id}>
              <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
                <RoomIcon
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                  style={{
                    color: "slateblue",
                    fontSize: "30px",
                    cursor: "pointer",
                  }}
                />
              </Marker>

              {p._id === currentPlaceId && (
                <Popup
                  longitude={p.long}
                  latitude={p.lat}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label className="">Place</label>
                    <h4 className="place">{p.title}</h4>
                    <label htmlFor="">Review</label>
                    <h4 className="desc">{p.desc}</h4>
                    <label htmlFor="">Rating</label>
                    <div className="stars">
                      {Array(p.rating).fill(<StarIcon className="star" />)}
                    </div>
                    <label htmlFor="">Information</label>
                    <span className="username">
                      Created by <b>{p.username}</b>{" "}
                    </span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </div>
          );
        })}

        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <form onSubmit={handleSubmit}>
              <label htmlFor="">Tital</label>
              <input
                type="text"
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="">Review</label>
              <textarea
                placeholder="Say us something about this place"
                onChange={(e) => setDesc(e.target.value)}
              ></textarea>
              <label htmlFor="">Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add Pin
              </button>
            </form>
          </Popup>
        )}

        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </>
  );
}

export default App;
