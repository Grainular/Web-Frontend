// src/components/Map.js
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect, useRef } from "react";

const containerStyle = {
    width: '1510px',
    height: '600px'
};

const center = {
    lat: 44.032052,
    lng: -65.488756
};

const libraries = ['drawing'];  // Keep libraries array outside of component

export default function Map() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
        libraries: libraries
    });

    const [map, setMap] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const overlayRef = useRef(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const imageResponse = await fetch('http://localhost:5000/process-image', {
                method: 'POST',
                body: formData,
            });
            if (!imageResponse.ok) {
                throw new Error(`Network response was not ok ${imageResponse.statusText}`);
            }
            const blob = await imageResponse.blob();
            const url = URL.createObjectURL(blob);
            setImageSrc(url);
    
            // Now make a request for the coordinates
            const coordResponse = await fetch('http://localhost:5000/coordinates');
            if (!coordResponse.ok) {
                throw new Error(`Network response was not ok ${coordResponse.statusText}`);
            }
            const coordData = await coordResponse.json();
            setCoordinates(coordData);  // Update the coordinates state variable
    
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }

        
        
        
    };

    useEffect(() => {
        if (map && imageSrc && coordinates) {
            const bounds = new window.google.maps.LatLngBounds(
                new window.google.maps.LatLng(coordinates.south, coordinates.west),
                new window.google.maps.LatLng(coordinates.north, coordinates.east)
            );
            const historicalOverlay = new window.google.maps.GroundOverlay(
                imageSrc,
                bounds,
                { opacity: 1 }
            );
            historicalOverlay.setMap(map);
            overlayRef.current = historicalOverlay;
            map.fitBounds(bounds);
        }
    }, [map, imageSrc, coordinates]);

    const onLoad = mapInstance => {
        setMap(mapInstance);
    };

    const onUnmount = () => {
        if (overlayRef.current) {
            overlayRef.current.setMap(null);
        }
    };

    return isLoaded ? (
        <div>
            <input type="file" onChange={handleFileUpload} />
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
            </GoogleMap>
        </div>
    ) : <></>;
}