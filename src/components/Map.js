// src/components/Map.js
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
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
        libraries: libraries
    });

    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({
        advanceNotice: '1 hour',
        phoneType: 'Cell Phone',
        provider: 'Select Provider',
        phoneNumber: '',
        showHistory: false,
        selectedDate: '',
    });

    const [historicalDates, setHistoricalDates] = useState([]);

    const onMapClick = (e) => {
        setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setShowPopup(true);  // Show the popup when marker is dropped
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPopupData({ ...popupData, [name]: value });
    };

    const handleSubmit = () => {
        if (popupData.showHistory) {
            calculateHistoricalDates();
        }
        setShowPopup(false);  // Close popup
    };

    const calculateHistoricalDates = () => {
        const dates = [];
        const startDate = new Date();
        let selectedDate = new Date(popupData.selectedDate);
        while (selectedDate <= startDate) {
            dates.push(selectedDate.toDateString());
            selectedDate.setDate(selectedDate.getDate() + 16);  // LANDSAT cycle
        }
        setHistoricalDates(dates);
    };

    return isLoaded ? (
        <div className="map-container">
            {/* Notification Bar */}
            <div className="notification-bar">
                {historicalDates.length > 0 && (
                    <div className="historical-dates">
                        <h4 className="section-heading">Historical Data</h4>
                        <div className="date-slider">
                            {historicalDates.map((date, index) => (
                                <button key={index} className="date-slider-btn">{date}</button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vegetation/Thermal Toggle */}
                <div className="toggle-options">
                    <h4 className="section-heading">Display Mode</h4>
                    <select className="toggle-select">
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

            {/* Popup for Notification Settings */}
            {showPopup && (
                <div className="popup bg-white p-6 border rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Customize Notifications</h3>

                    <label>How far in advance do you want the notification?</label>
                    <select name="advanceNotice" value={popupData.advanceNotice} onChange={handleInputChange}>
                        <option value="1 hour">1 Hour Before</option>
                        <option value="1 day">1 Day Before</option>
                        <option value="2 weeks">2 Weeks Before</option>
                    </select>

                    <label>Phone Type</label>
                    <select name="phoneType" value={popupData.phoneType} onChange={handleInputChange}>
                        <option value="Cell Phone">Cell Phone</option>
                        <option value="SAT Phone">SAT Phone</option>
                    </select>

                    <label>Provider</label>
                    <select name="provider" value={popupData.provider} onChange={handleInputChange}>
                        <option value="Verizon">Verizon</option>
                        <option value="AT&T">AT&T</option>
                        {/* Add other providers */}
                    </select>

                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" value={popupData.phoneNumber} onChange={handleInputChange} />

                    <label>Show Historical Data?</label>
                    <input
                        type="checkbox"
                        name="showHistory"
                        checked={popupData.showHistory}
                        onChange={() => setPopupData({ ...popupData, showHistory: !popupData.showHistory })}
                    />

                    {popupData.showHistory && (
                        <div>
                            <label>Select Date for Historical Data</label>
                            <input type="date" name="selectedDate" onChange={handleInputChange} />
                        </div>
                    )}

                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            )}
        </div>
    ) : <></>;
}
