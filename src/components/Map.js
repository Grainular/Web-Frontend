// Web-Frontend/src/components/Map.js

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import React, { useState } from "react";
import '../css/MapStyles.css'; // Custom styles
import axios from 'axios'; // Install axios using `npm install axios`

const containerStyle = {
    width: '100%', // Responsive width
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
        advanceNoticeNumber: 1,
        advanceNoticeUnit: 'hours',
        phoneType: 'Cell Phone',
        provider: 'Select Provider',
        phoneNumber: '',
        showHistory: false,
        selectedDate: '',
        latitude: '',
        longitude: '',
        mode: 'vegetation', // For Vegetation or Thermal overlay
    });
    const [historicalDates, setHistoricalDates] = useState([]);
    const [landsatPassInfo, setLandsatPassInfo] = useState(null);
    const [downloadedScenes, setDownloadedScenes] = useState([]);

    const onMapClick = async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        setPopupData({ ...popupData, latitude: lat, longitude: lng });
        setShowPopup(true);

        // Fetch Landsat pass information
        try {
            const response = await axios.post('http://localhost:5000/api/get-landsat-pass', {
                latitude: lat,
                longitude: lng
            });
            setLandsatPassInfo(response.data);
        } catch (error) {
            console.error('Error fetching Landsat pass info:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPopupData({ ...popupData, [name]: value });
    };

    const handleSubmit = async () => {
        if (popupData.showHistory) {
            calculateHistoricalDates();
        }

        // Download Landsat data based on user input
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/download-landsat', {
                latitude: parseFloat(popupData.latitude),
                longitude: parseFloat(popupData.longitude),
                start_date: popupData.selectedDate || '2022-01-01',
                end_date: '2022-12-31', // You can make this dynamic
                max_cloud_cover: 10 // You can also make this dynamic
            });
            setDownloadedScenes(response.data.downloaded_scenes);
        } catch (error) {
            console.error('Error downloading Landsat data:', error);
        }

        setShowPopup(false);  // Close popup after submit
    };

    const calculateHistoricalDates = () => {
        const dates = [];
        const startDate = new Date();
        let selectedDate = new Date(popupData.selectedDate);

        // Calculate historical dates based on LANDSAT cycle (16 days)
        while (selectedDate <= startDate) {
            dates.push(selectedDate.toDateString());
            selectedDate.setDate(selectedDate.getDate() + 16);
        }
        setHistoricalDates(dates);
    };

    const handleLatLongSubmit = async () => {
        const lat = parseFloat(popupData.latitude);
        const lng = parseFloat(popupData.longitude);
        setMarker({ lat, lng });
        setShowPopup(true);

        // Fetch Landsat pass information
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/get-landsat-pass', {
                latitude: lat,
                longitude: lng
            });
            setLandsatPassInfo(response.data);
        } catch (error) {
            console.error('Error fetching Landsat pass info:', error);
        }
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
                <button className="latlong-submit-btn" onClick={handleLatLongSubmit}>Submit</button>
            </div>

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
                    <select name="mode" value={popupData.mode} onChange={handleInputChange} className="toggle-select">
                        <option value="vegetation">Vegetation</option>
                        <option value="thermal">Thermal</option>
                    </select>
                </div>
            </div>

            {/* Map */}
            <div className="map-wrapper">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={marker || center}
                    zoom={13}
                    onClick={onMapClick}
                    onLoad={setMap}
                >
                    {marker && <Marker position={marker} />}
                </GoogleMap>
            </div>

            {/* Popup for Notification Settings */}
            {showPopup && (
                <div className="popup">
                    <button className="popup-close-btn" onClick={() => setShowPopup(false)}>X</button>
                    
                    <h3 className="popup-heading">Customize Notifications</h3>

                    {/* Display selected Lat/Lng */}
                    <label>Latitude</label>
                    <input type="text" name="latitude" value={popupData.latitude} onChange={handleInputChange} />

                    <label>Longitude</label>
                    <input type="text" name="longitude" value={popupData.longitude} onChange={handleInputChange} />

                    {/* Notification Time (Similar to Google Calendar) */}
                    <label>Notification Time</label>
                    <div className="notification-time-input">
                        <input
                            type="number"
                            name="advanceNoticeNumber"
                            value={popupData.advanceNoticeNumber}
                            onChange={handleInputChange}
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
                    <select name="phoneType" value={popupData.phoneType} onChange={handleInputChange}>
                        <option value="Cell Phone">Cell Phone</option>
                        <option value="SAT Phone">SAT Phone</option>
                    </select>

                    <label>Provider</label>
                    <select name="provider" value={popupData.provider} onChange={handleInputChange}>
                        <option value="Verizon">Verizon</option>
                        <option value="AT&T">AT&T</option>
                        {/* Add more providers as needed */}
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

            {/* Display Landsat Pass Information */}
            {landsatPassInfo && (
                <div className="landsat-pass-info">
                    <h3>Landsat Pass Information</h3>
                    <p><strong>Path:</strong> {landsatPassInfo.path}</p>
                    <p><strong>Row:</strong> {landsatPassInfo.row}</p>
                    <p><strong>Next Landsat 8 Pass:</strong> {landsatPassInfo.soonest_landsat_8}</p>
                    <p><strong>Next Landsat 9 Pass:</strong> {landsatPassInfo.soonest_landsat_9}</p>
                </div>
            )}

            {/* Display Downloaded Scenes */}
            {downloadedScenes.length > 0 && (
                <div className="downloaded-scenes">
                    <h3>Downloaded Scenes</h3>
                    <ul>
                        {downloadedScenes.map((scene, index) => (
                            <li key={index}>{scene}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    ) : <></>;
}
