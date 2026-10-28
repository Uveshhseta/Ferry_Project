import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, 
  Layers, 
  Clock, 
  Compass, 
  Anchor, 
  ArrowRight, 
  Bike, 
  LifeBuoy,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

// Verified Geographic Coordinates for Toronto Harbour & Islands
const TERMINAL_COORDINATES = [
  {
    id: 'jack-layton',
    name: 'Jack Layton Ferry Terminal',
    shortName: 'Jack Layton (Mainland)',
    lat: 43.6407,
    lng: -79.3754,
    type: 'mainland',
    location: '9 Queens Quay West, Downtown Toronto',
    description: 'Central downtown departure terminal at the foot of Bay Street with 4 active boarding slips, ticket kiosks, washrooms, and TTC connections.',
    transit: 'TTC Subway Line 1 (Union Station), 509 Harbourfront & 510 Spadina Streetcars',
    gates: ['Gate 1 (Hanlan)', 'Gate 2 (Centre)', 'Gate 3 (Ward)', 'Gate 4 (Peak Relief)'],
    amenities: ['Public Restrooms', 'Water Refill', 'TTC Connections', 'Ticket Kiosks']
  },
  {
    id: 'centre-island',
    name: 'Centre Island Terminal',
    shortName: 'Centre Island',
    lat: 43.6204,
    lng: -79.3763,
    type: 'island',
    location: 'Central Toronto Island Park',
    description: 'Primary island visitor destination featuring Centreville Amusement Park, Franklin Children’s Garden, bike rentals, and vast picnic grounds.',
    transit: 'Island Tram Service, Bicycles, Paved Footpaths',
    transitTimeMinutes: 13,
    distanceKm: 2.1,
    amenities: ['Centreville Amusement', 'Washrooms', 'Picnic Areas', 'Bike Rentals']
  },
  {
    id: 'hanlans-point',
    name: "Hanlan's Point Terminal",
    shortName: "Hanlan's Point",
    lat: 43.6188,
    lng: -79.3921,
    type: 'island',
    location: 'Western Toronto Island',
    description: 'Direct access to Hanlan’s Point sandy beach and dunes, historic Gibraltar Point Lighthouse (1808), baseball diamonds, and bike trails.',
    transit: 'Billy Bishop Pedestrian Tunnel nearby, Walking / Bike Trails',
    transitTimeMinutes: 11,
    distanceKm: 1.8,
    amenities: ['Sandy Beach', 'Historic Lighthouse (1808)', 'Bicycle Trails', 'Washrooms']
  },
  {
    id: 'wards-island',
    name: "Ward's Island Terminal",
    shortName: "Ward's Island",
    lat: 43.6277,
    lng: -79.3597,
    type: 'island',
    location: 'Eastern Toronto Island',
    description: 'Charming 1920s historic cottage community, quiet residential footpaths, lakeside boardwalk, sandy beaches, and The Riviera Cafe.',
    transit: 'Waterfront Boardwalk, Residential Footpaths',
    transitTimeMinutes: 15,
    distanceKm: 2.5,
    amenities: ['Lakeside Boardwalk', 'The Riviera & Island Cafe', 'Sandy Beaches', 'Cottage Gardens']
  }
];

// Landmark POIs on Toronto Islands
const ISLAND_LANDMARKS = [
  {
    name: 'Centreville Amusement Park',
    category: 'Family Attraction',
    lat: 43.6215,
    lng: -79.3735,
    desc: 'Over 30 vintage rides, historic carousel, family picnic grounds.'
  },
  {
    name: 'Gibraltar Point Lighthouse',
    category: 'Historic Landmark',
    lat: 43.6148,
    lng: -79.3860,
    desc: 'Constructed in 1808, oldest stone structure in Toronto and Great Lakes.'
  },
  {
    name: "Hanlan's Point Beach & Dunes",
    category: 'Beach & Nature',
    lat: 43.6175,
    lng: -79.3950,
    desc: 'Soft sand dunes, panoramic Lake Ontario sunset vistas.'
  },
  {
    name: "Ward's Island Waterfront Boardwalk",
    category: 'Scenic Trail',
    lat: 43.6240,
    lng: -79.3630,
    desc: 'Scenic 5.5 km waterfront wooden path along Lake Ontario shoreline.'
  }
];

export default function RouteMapsPage() {
  const { navigateTo, openAuthModal, isAuthenticated, t, locTerminal, language } = useApp();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  const [selectedTerminal, setSelectedTerminal] = useState(TERMINAL_COORDINATES[1]); // Default Centre Island
  const [activeLayers, setActiveLayers] = useState({
    ferryRoutes: true,
    bikeTrails: true,
    landmarks: true
  });
  const [mapError, setMapError] = useState(null);

  const toggleLayer = (layerName) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset container if previously initialized (e.g. StrictMode or route transitions)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    try {
      // Create Map centered on Toronto Inner Harbour
      const map = L.map(mapContainerRef.current, {
        center: [43.6295, -79.3780],
        zoom: 13,
        minZoom: 12,
        maxZoom: 17,
        zoomControl: true,
        scrollWheelZoom: true
      });

      mapInstanceRef.current = map;

      // Add Official OpenStreetMap Standard Tile Layer
      const osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors • City of Toronto PF&R',
        maxZoom: 19,
        crossOrigin: true
      });

      osmTileLayer.on('tileerror', (error) => {
        console.warn('Map tile failed to load gracefully:', error);
      });

      osmTileLayer.addTo(map);

      // Invalidate size once rendered in DOM
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      setMapError('Failed to load map tiles. Please check your internet connection.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers, Routes, and Layers when State Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous dynamic markers & lines
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    polylinesRef.current.forEach(l => map.removeLayer(l));
    polylinesRef.current = [];

    const mainland = TERMINAL_COORDINATES[0]; // Jack Layton

    // 1. Plot Terminals with Maritime Beacon Glow
    TERMINAL_COORDINATES.forEach((term) => {
      const isSelected = selectedTerminal?.id === term.id;
      const isMainland = term.type === 'mainland';

      const iconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          ${isSelected ? `
            <div style="
              position: absolute;
              width: 54px;
              height: 54px;
              border-radius: 50%;
              border: 2px solid ${isMainland ? '#0077c8' : '#ea580c'};
              animation: sonarPingRing 2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              pointer-events: none;
            "></div>
          ` : ''}
          <div style="
            background-color: ${isMainland ? '#004f8b' : isSelected ? '#ea580c' : '#15803d'};
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 6px 16px rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${isSelected ? '16px' : '13px'};
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            ⚓
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'ferry-dock-marker',
        html: iconHtml,
        iconSize: [isSelected ? 54 : 32, isSelected ? 54 : 32],
        iconAnchor: [isSelected ? 27 : 16, isSelected ? 27 : 16]
      });

      const marker = L.marker([term.lat, term.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <strong style="font-size: 14px; color: #003366;">${term.name}</strong><br/>
            <span style="color: #64748b;">${term.location}</span><br/>
            <p style="margin: 4px 0 0 0; color: #334155;">${term.description}</p>
          </div>
        `);

      marker.on('click', () => {
        setSelectedTerminal(term);
      });

      markersRef.current.push(marker);
    });

    // 2. Draw Nautical Ferry Routes from Jack Layton
    if (activeLayers.ferryRoutes) {
      const islandDocks = TERMINAL_COORDINATES.filter(t => t.type === 'island');
      islandDocks.forEach((dock) => {
        const isRouteSelected = selectedTerminal?.id === dock.id;
        const polyline = L.polyline(
          [
            [mainland.lat, mainland.lng],
            [dock.lat, dock.lng]
          ],
          {
            color: isRouteSelected ? '#ea580c' : '#0284c7',
            weight: isRouteSelected ? 4 : 3,
            opacity: isRouteSelected ? 0.95 : 0.7,
            dashArray: '8, 6'
          }
        ).addTo(map);

        polyline.bindTooltip(
          `<strong>${mainland.shortName} ➔ ${dock.shortName}</strong><br/>${dock.distanceKm} km • ~${dock.transitTimeMinutes} mins`,
          { sticky: true }
        );

        polylinesRef.current.push(polyline);

        // Mid-Route Active Ferry Marker
        const midpointLat = (mainland.lat + dock.lat) / 2;
        const midpointLng = (mainland.lng + dock.lng) / 2;
        const vesselName = dock.id === 'hanlans-point' ? 'MV Thomas Rennie' : dock.id === 'wards-island' ? 'MV William Inglis' : 'MV Sam McBride';
        
        const vesselIcon = L.divIcon({
          className: 'ferry-live-vessel',
          html: `
            <div style="
              background: #002d54;
              color: #38bdf8;
              border: 1.5px solid #38bdf8;
              padding: 2px 7px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 800;
              box-shadow: 0 4px 12px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span style="font-size: 11px;">🚢</span>
              <span>${vesselName}</span>
              <span style="color: #4ade80; font-size: 9px;">• 10 kts</span>
            </div>
          `,
          iconSize: [110, 22],
          iconAnchor: [55, 11]
        });

        const vesselMarker = L.marker([midpointLat, midpointLng], { icon: vesselIcon })
          .addTo(map)
          .bindTooltip(`<strong>${vesselName}</strong><br/>En route to ${dock.shortName} (~${dock.transitTimeMinutes}m crossing)`);

        markersRef.current.push(vesselMarker);
      });
    }

    // 3. Draw Island Boardwalk & Bike Trail Line
    if (activeLayers.bikeTrails) {
      const trailCoords = [
        [43.6188, -79.3921], // Hanlan's
        [43.6148, -79.3860], // Gibraltar Point
        [43.6204, -79.3763], // Centre Island
        [43.6240, -79.3630], // Boardwalk
        [43.6277, -79.3597]  // Ward's Island
      ];

      const trailLine = L.polyline(trailCoords, {
        color: '#16a34a',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '4, 4'
      }).addTo(map);

      trailLine.bindTooltip('<strong>Island Boardwalk & Cycling Trail</strong><br/>5.5 km paved scenic path', { sticky: true });
      polylinesRef.current.push(trailLine);
    }

    // 4. Plot Landmarks & POIs
    if (activeLayers.landmarks) {
      ISLAND_LANDMARKS.forEach((poi) => {
        const poiIcon = L.divIcon({
          className: 'island-poi-marker',
          html: `
            <div style="
              background-color: #f59e0b;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
            ">
              ★
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const poiMarker = L.marker([poi.lat, poi.lng], { icon: poiIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-size: 11px;">
              <strong style="color: #b45309; font-size: 13px;">${poi.name}</strong><br/>
              <span style="color: #64748b;">${poi.category}</span><br/>
              <p style="margin: 4px 0 0 0; color: #334155;">${poi.desc}</p>
            </div>
          `);

        markersRef.current.push(poiMarker);
      });
    }

  }, [selectedTerminal, activeLayers]);

  // Center on Selected Terminal
  const handleSelectTerminal = (term) => {
    setSelectedTerminal(term);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([term.lat, term.lng], 14, { duration: 1.2 });
    }
  };

  const handleBookSelectedDock = () => {
    const destination = selectedTerminal.type === 'mainland' ? 'Centre Island' : selectedTerminal.name;
    const origin = selectedTerminal.type === 'mainland' ? selectedTerminal.name : 'Jack Layton Ferry Terminal';

    if (!isAuthenticated) {
      openAuthModal('login', 'booking');
    } else {
      navigateTo('booking', { from: origin, to: destination });
    }
  };

  const getLocalizedAmenity = (amenity) => {
    if (language !== 'fr') return amenity;
    const map = {
      'Public Restrooms': 'Toilettes publiques',
      'Water Refill': 'Station de remplissage d’eau',
      'TTC Connections': 'Correspondances TTC',
      'Ticket Kiosks': 'Bornes de billetterie',
      'Centreville Amusement': 'Parc d’attractions Centreville',
      'Washrooms': 'Toilettes',
      'Picnic Areas': 'Aires de pique-nique',
      'Bike Rentals': 'Location de vélos',
      'Sandy Beach': 'Plage sablonneuse',
      'Historic Lighthouse (1808)': 'Phare historique (1808)',
      'Bicycle Trails': 'Pistes cyclables',
      'Lakeside Boardwalk': 'Promenade riveraine',
      'The Riviera & Island Cafe': 'Cafés The Riviera & Island',
      'Sandy Beaches': 'Plages de sable',
      'Cottage Gardens': 'Jardins de chalets'
    };
    return map[amenity] || amenity;
  };

  const getLocalizedDesc = (term) => {
    if (language !== 'fr') return term.description;
    if (term.id === 'jack-layton') {
      return 'Terminal central de départ au centre-ville, au pied de la rue Bay, comprenant 4 cales d’embarquement actives, des bornes de billetterie, des toilettes et des correspondances TTC.';
    }
    if (term.id === 'centre-island') {
      return 'Principale destination de l’île comprenant le parc d’attractions Centreville, le jardin pour enfants Franklin, la location de vélos et de vastes aires de pique-nique.';
    }
    if (term.id === 'hanlans-point') {
      return 'Accès direct aux plages et dunes de la pointe Hanlan, au phare historique de Gibraltar Point (1808), aux terrains de baseball et aux sentiers cyclables.';
    }
    if (term.id === 'wards-island') {
      return 'Charmante communauté historique de chalets des années 1920, sentiers résidentiels calmes, promenade riveraine, plages de sable et café The Riviera.';
    }
    return term.description;
  };

  const getLocalizedLocation = (term) => {
    if (language !== 'fr') return term.location;
    if (term.id === 'jack-layton') return '9 Queens Quay Ouest, centre-ville de Toronto';
    if (term.id === 'centre-island') return 'Parc central des îles de Toronto';
    if (term.id === 'hanlans-point') return 'Secteur ouest des îles de Toronto';
    if (term.id === 'wards-island') return 'Secteur est des îles de Toronto';
    return term.location;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span>{language === 'fr' ? 'Navigation maritime portuaire • Leaflet et OpenStreetMap en direct' : 'Harbour Marine Navigation • Live Leaflet & OpenStreetMap'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('routeMapsTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('routeMapsSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBookSelectedDock}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <span>{t('bookPassToDock')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Layer Filters Strip */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Couches de carte :' : 'Map Layers:'}</span>
          </span>

          <button
            onClick={() => toggleLayer('ferryRoutes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLayers.ferryRoutes ? 'bg-[#004f8b] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>{t('ferryRoutes')}</span>
          </button>

          <button
            onClick={() => toggleLayer('bikeTrails')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLayers.bikeTrails ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>{t('boardwalkTrail')}</span>
          </button>

          <button
            onClick={() => toggleLayer('landmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeLayers.landmarks ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('landmarksPOIs')}</span>
          </button>

          {/* Quick Dock Switcher */}
          <div className="ml-auto flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline mr-1">{language === 'fr' ? 'Quai ciblé :' : 'Focus Dock:'}</span>
            {TERMINAL_COORDINATES.map(term => (
              <button
                key={term.id}
                onClick={() => handleSelectTerminal(term)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  selectedTerminal?.id === term.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {locTerminal(term.shortName.split(' ')[0])}
              </button>
            ))}
          </div>
        </div>

        {/* Main Map Container & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Leaflet Interactive Map Canvas */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-2 shadow-xl border border-slate-200 relative overflow-hidden flex flex-col min-h-[520px]">
            {mapError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-600">
                <LifeBuoy className="w-12 h-12 text-rose-500 mb-2" />
                <h3 className="font-bold text-slate-800">{language === 'fr' ? 'Erreur de chargement de la carte' : 'Map Loading Error'}</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">{mapError}</p>
              </div>
            ) : (
              <div className="relative w-full h-full min-h-[520px]">
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-full min-h-[520px] rounded-2xl z-0"
                />
                
                {/* Floating Nautical Telemetry HUD */}
                <div className="absolute top-3 right-3 z-10 hidden sm:flex flex-col gap-1.5 bg-[#001d3d]/90 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-3 shadow-xl text-white text-[11px] font-mono pointer-events-auto">
                  <div className="flex items-center justify-between gap-3 text-cyan-300 font-bold border-b border-white/10 pb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>{language === 'fr' ? 'Télémétrie portuaire' : 'Harbour Telemetry'}</span>
                    </span>
                    <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-200">
                      43.64° N, 79.37° W
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300 text-[10px] pt-0.5">
                    <div>{language === 'fr' ? 'Vent :' : 'Wind:'} <strong className="text-white">9 kts SSW</strong></div>
                    <div>{language === 'fr' ? 'Houle :' : 'Swell:'} <strong className="text-white">0.2m {language === 'fr' ? 'Calme' : 'Calm'}</strong></div>
                    <div>{language === 'fr' ? 'Eau :' : 'Water:'} <strong className="text-white">18°C</strong></div>
                    <div>{language === 'fr' ? 'Flotte :' : 'Fleet:'} <strong className="text-emerald-400">4/5 Active</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Data Note Ribbon */}
            <div className="p-3 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{language === 'fr' ? 'Tuiles OpenStreetMap réelles avec quais officiels des îles de Toronto' : 'Real geographic OpenStreetMap tiles with verified Toronto Island docks'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#0284c7] inline-block"></span> {t('ferryRoutes')}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-1 bg-[#16a34a] inline-block"></span> {t('boardwalkTrail')}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ea580c] inline-block"></span> {language === 'fr' ? 'Quai sélectionné' : 'Active Dock'}</span>
              </div>
            </div>
          </div>

          {/* Interactive Selected Terminal Detail Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {selectedTerminal && (
              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      selectedTerminal.type === 'mainland' ? 'bg-blue-100 text-[#004f8b]' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedTerminal.type === 'mainland' ? t('mainlandTerminal') : t('islandTerminal')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedTerminal.lat.toFixed(4)}°N, {Math.abs(selectedTerminal.lng).toFixed(4)}°W
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {locTerminal(selectedTerminal.name)}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{getLocalizedLocation(selectedTerminal)}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {getLocalizedDesc(selectedTerminal)}
                  </p>

                  {/* Distance & Duration if Island Dock */}
                  {selectedTerminal.transitTimeMinutes && (
                    <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{t('approxTime')}</div>
                        <div className="text-lg font-black text-[#004f8b] flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>~{selectedTerminal.transitTimeMinutes} min</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{t('crossingDistance')}</div>
                        <div className="text-lg font-black text-slate-800">
                          {selectedTerminal.distanceKm} km
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Public Transit Links */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('transitConnections')}:</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {selectedTerminal.transit}
                    </p>
                  </div>

                  {/* Terminal Slips & Amenities */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 mb-2">{t('terminalAmenities')}:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTerminal.amenities?.map((amenity, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{getLocalizedAmenity(amenity)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleBookSelectedDock}
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Anchor className="w-4 h-4" />
                    <span>{t('bookPassToDock')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Terminal Guide List */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#004f8b]" />
                <span>{t('allTerminals')}</span>
              </h3>
              <div className="space-y-2">
                {TERMINAL_COORDINATES.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => handleSelectTerminal(term)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      selectedTerminal?.id === term.id
                        ? 'bg-blue-50 border border-blue-200 font-bold text-[#004f8b]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{locTerminal(term.name)}</span>
                    <span className="text-[10px] opacity-60 ml-2 shrink-0">
                      {term.type === 'mainland' ? (language === 'fr' ? 'Centre-ville' : 'Downtown') : `${term.transitTimeMinutes} min`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
