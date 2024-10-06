import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import React, { useState } from "react";
import '../css/MapStyles.css';

const containerStyle = {
    width: '1510px',
    height: '500px'
};

const center = {
    lat: 44.032052,
    lng: -65.488756
};

const libraries = ['drawing'];

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSubmitted, setPopupSubmitted] = useState(false);
  const [popupData, setPopupData] = useState({
    advanceNoticeNumber: 1,
    advanceNoticeUnit: "hours",
    phoneType: "Cell Phone",
    provider: "Select Provider",
    phoneNumber: "",
    showHistory: false,
    selectedDate: "",
    latitude: "",
    longitude: "",
    mode: "vegetation", // For Vegetation or Thermal overlay
  });
  const [historicalDates, setHistoricalDates] = useState([]);

  const onMapClick = (e) => {
    setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setPopupData({
      ...popupData,
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPopupData({ ...popupData, [name]: value });

    // Automatically pans the map when latitude or longitude changes
    if (name === "latitude" || name === "longitude") {
      const lat =
        name === "latitude"
          ? parseFloat(value)
          : parseFloat(popupData.latitude);
      const lng =
        name === "longitude"
          ? parseFloat(value)
          : parseFloat(popupData.longitude);

      // Pan the map to the new coordinates. Then update the marker position
      if (map && !isNaN(lat) && !isNaN(lng)) {
        map.panTo({ lat, lng });
        setMarker({ lat, lng });
      }
    }
  };

  const handleSubmit = () => {
    if (popupData.showHistory) {
      calculateHistoricalDates();
    }
    // overlayImages();  // TODO: Overlay Vegetation or Thermal images based on user choice
    setPopupSubmitted(true);
    console.log(popupData);
  };

  // Resets the latitude and longitude fields
  const handleReset = () => {
    setPopupData({
      ...popupData,
      latitude: "",
      longitude: "",
    });

    // Reset the marker and pan the map back to the default center
    setMarker(null);
    if (map) {
      map.panTo(center); // Pan back to the default center
    }
  };

  // const overlayImages = () => {
  //     const bounds = new window.google.maps.LatLngBounds(
  //         new window.google.maps.LatLng(popupData.latitude - 0.05, popupData.longitude - 0.05),
  //         new window.google.maps.LatLng(popupData.latitude + 0.05, popupData.longitude + 0.05)
  //     );
  //     const imageSrc = popupData.mode === 'vegetation' ? 'src\assets\images\LC08_L1TP_007029_20241004_20241004_02_RT.jpg' : 'src\assets\images\LC09_L1TP_007029_20240926_20240926_02_T1.jpg';
  //     const historicalOverlay = new window.google.maps.GroundOverlay(imageSrc, bounds);
  //     historicalOverlay.setMap(map);
  // };

  const calculateHistoricalDates = () => {
    const dates = [];
    const startDate = new Date();
    let selectedDate = new Date(popupData.selectedDate);

    // TODO: Update this so that it calculates the historical dates based on the last time LANDSAT passed over the selected point.
    while (selectedDate <= startDate) {
      dates.push(selectedDate.toDateString());
      selectedDate.setDate(selectedDate.getDate() + 16); // LANDSAT cycle
    }
    setHistoricalDates(dates);
  };

  const handleLatLongSubmit = () => {
    setMarker({
      lat: parseFloat(popupData.latitude),
      lng: parseFloat(popupData.longitude),
    });
    setShowPopup(true);
  };

  return isLoaded ? (
    <div className="map-container">
      {/* Latitude and Longitude Input Section */}
      <div className="coordinates-input">
        <input
          type="text"
          name="latitude"
          placeholder="Latitude"
          value={popupData.latitude}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={popupData.longitude}
          onChange={handleInputChange}
        />
        <button className="latlong-submit-btn" onClick={handleLatLongSubmit}>
          Add Notification
        </button>
        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Notification Bar */}
      <div className="notification-bar">
        {historicalDates.length > 0 && (
          <div className="historical-dates">
            <h4 className="section-heading">Historical Data</h4>
            <div className="date-slider">
              {historicalDates.map((date, index) => (
                <button key={index} className="date-slider-btn">
                  {date}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vegetation/Thermal Toggle */}
        <div className="toggle-options">
          <h4 className="section-heading">Display Mode</h4>
          <select
            name="mode"
            value={popupData.mode}
            onChange={handleInputChange}
            className="toggle-select"
          >
            <option value="vegetation">Vegetation</option>
            <option value="thermal">Thermal</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={onMapClick}
          onLoad={setMap}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>

      {/* Popup Overlay */}
      {showPopup && <div className="popup-overlay"></div>}

      {/* Popup for Notification Settings */}
      {showPopup && (
        <div className="popup bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-auto mt-10">
          <button
            className="popup-close-btn text-gray-500 hover:text-gray-700 absolute top-2 right-2 text-lg"
            onClick={() => {
              setShowPopup(false);
              setPopupSubmitted(false);
            }}
          >
            X
          </button>

          {/* show success message */}
          {popupSubmitted ? (
            <div className="success-message text-center">
              <h1 className="success-heading text-green-600 text-2xl md:text-4xl font-bold mb-4">
                Notifications Activated!
              </h1>
              <div className="flex justify-center items-center mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 md:mt-12 md:mb-12 border-4 border-green-600 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-6xl md:text-8xl">✓</span>
                </div>
              </div>
              <p className="text-gray-700 text-lg md:text-xl">
                Each time LANDSAT passes over <strong> {popupData.latitude}, {popupData.longitude} </strong>, you'll receive notifications <strong> {popupData.advanceNoticeNumber} {popupData.advanceNoticeUnit} </strong> in advance!
              </p>
            </div>
          ) : (
            <>
              <h3 className="popup-heading">Customize Notifications</h3>

              {/* Display selected Lat/Lng */}
              <label>Latitude</label>
              <input
                type="text"
                name="latitude"
                value={popupData.latitude}
                onChange={handleInputChange}
              />

              <label>Longitude</label>
              <input
                type="text"
                name="longitude"
                value={popupData.longitude}
                onChange={handleInputChange}
              />

              {/* Notification Time (Similar to Google Calendar) */}
              <label>Notification Time</label>
              <div className="notification-time-container">
                <input
                  type="number"
                  name="advanceNoticeNumber"
                  value={popupData.advanceNoticeNumber}
                  onChange={handleInputChange}
                  className="notification-time-input"
                />
                <select
                  name="advanceNoticeUnit"
                  value={popupData.advanceNoticeUnit}
                  onChange={handleInputChange}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>

              <label>Phone Type</label>
              <select
                name="phoneType"
                value={popupData.phoneType}
                onChange={handleInputChange}
              >
                <option value="Cell Phone">Cell Phone</option>
                <option value="SAT Phone">SAT Phone</option>
              </select>

              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={popupData.phoneNumber}
                onChange={handleInputChange}
              />

              <label>Provider</label>
              <select
                name="provider"
                value={popupData.provider}
                onChange={handleInputChange}
              >
                <option value="Verizon">Verizon</option>
                <option value="AT&T">AT&T</option>
              </select>

              <label>Show Historical Data?</label>
              <input
                type="checkbox"
                name="showHistory"
                checked={popupData.showHistory}
                onChange={() =>
                  setPopupData({
                    ...popupData,
                    showHistory: !popupData.showHistory,
                  })
                }
              />

              {popupData.showHistory && (
                <div>
                  <label>Select Date for Historical Data</label>
                  <input
                    type="date"
                    name="selectedDate"
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <br></br>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit
              </button>
            </>
          )}
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}
