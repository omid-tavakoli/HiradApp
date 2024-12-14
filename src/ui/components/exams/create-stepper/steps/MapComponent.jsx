import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

const MapComponent = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      center: [31.6, 54.356857],
      zoom: 7,
    });
    mapInstanceRef.current = map;
    L.tileLayer(
      "https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        attribution: "",
      }
    ).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));
      updateMarkerPosition(lat, lng);
    });

    return () => {
      map.remove();
    };
  }, []);

  const updateMarkerPosition = (lat, lng) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    map.setView([lat, lng], 13);
    if (onLocationSelect) {
      onLocationSelect({ lat, lng });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon } = results[0];
        setLatitude(parseFloat(lat).toFixed(6));
        setLongitude(parseFloat(lon).toFixed(6));
        updateMarkerPosition(parseFloat(lat), parseFloat(lon));
      } else {
        toast.error("مکان مورد نظر پیدا نشد.");
      }
    } catch (error) {
      toast.error("خطا در جستجو:", error);
    }
  };

  const handleConfirm = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("لطفاً طول و عرض جغرافیایی معتبر وارد کنید.");
      return;
    }

    updateMarkerPosition(lat, lng);
  };

  return (
    <div>
      <div className="flex items-center gap-x-2 mb-4">
        <input
          type="text"
          placeholder="جستجوی مکان..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex w-full border border-gray-300 rounded-md px-2 py-1"
        />
        <button onClick={handleSearch} className="btn-primary mt-2">
          جستجو
        </button>
      </div>

      <div className="flex items-center gap-x-2 mb-4">
        <input
          type="text"
          placeholder="عرض جغرافیایی (Latitude)"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="flex w-full border border-gray-300 rounded-md px-2 py-1"
        />
        <input
          type="text"
          placeholder="طول جغرافیایی (Longitude)"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="flex w-full border border-gray-300 rounded-md px-2 py-1"
        />
        <button onClick={handleConfirm} className="btn-primary">
        جستجو
        </button>
      </div>

      <div ref={mapRef} className="w-full h-[400px] rounded-md" />
    </div>
  );
};

export default MapComponent;
