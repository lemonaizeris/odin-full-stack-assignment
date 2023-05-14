import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Fragment,
  useState,
  useEffect,
  useMemo
} from 'react';
import MapGL, {
  Source,
  Layer,
  LayerProps,
  Marker,
  NavigationControl,
  ScaleControl
} from 'react-map-gl';

import Loading from './components/Loading';
import {
  Viewport,
  LocationMarker,
  LighthouseMarker
} from './models/nauvo';
import {
  GetSARImageNauvo,
  GetSARImageNauvoCoordinates,
  GetSWFinlandLighthouses
} from './routes/nauvo';
import configData from "./config.json";


const ErrorMessage = () => {
  return (
      <div className="error-message-container">
        <h1 className="error-message">
        ERROR 404 - ODIN NOT FOUND
        </h1>
      </div>
  );
};

export const App = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [odinNotFound, setOdinNotFound] = useState(false);
  const [sarImageLayerStyle] = useState<LayerProps>({
    id: 'SAR_image_layer',
    type: 'raster'
  });
  const [lighthousesLayerStyle] = useState<LayerProps>({
    id: 'lighthouses_layer',
    type: 'circle'
  });
  const [lighthousesRangeLayerStyle] = useState<LayerProps>({
    id: 'lighthouses_range_layer',
    type: 'circle',
    paint: {
      'circle-color': '#fee08b',
      'circle-opacity': 0.6,
      'circle-radius': 30
    }
  });
  const [viewport] = useState<Viewport>({
    latitude: 59.8613,
    longitude: 22.4673,
    zoom: 11.25
  });
  const [currentShipLocationMarker] = useState<LocationMarker>({
    latitude: 59.89134,
    longitude: 22.30606,
    anchor: "bottom"
  })
  const [SARImageUrl, setSARImageUrl] = useState<string>('');
  const [SARImageCoordinates, setSARImageCoordinates] = useState([]);
  const [SWFinlandLighthousesGeoJSON, setSWFinlandLighthousesGeoJSON] = useState<any>(null);
  //const [SWFinlandLighthouses, setSWFinlandLighthouses] = useState<LighthouseMarker[]>([]);

  useEffect(() => {
    const getSARImageNauvo = async() => {
      setLoading(true);
      GetSARImageNauvo()
      .then((response) => {
        setOdinNotFound(false);
        setSARImageUrl(response.request.responseURL);
        getSARImageNauvoCoordinates();
      }).catch((error) => {
        setOdinNotFound(true);
        setLoading(false);
      })
    }

    const getSARImageNauvoCoordinates = async() => {
      GetSARImageNauvoCoordinates()
      .then((response) => {
        setSARImageCoordinates(response.data.nauvo_image);
        getSWFinlandLighthouses()
      }).catch((error) => {
        
        setOdinNotFound(true);
        setLoading(false);
      })
    }

    const getSWFinlandLighthouses = async() => {
      GetSWFinlandLighthouses()
      .then((response) => {
        setSWFinlandLighthousesGeoJSON(response.data);
        setLoading(false);
      }).catch((error) => {
        
        setOdinNotFound(true);
        setLoading(false);
      })
    }

    getSARImageNauvo();
  }, []);

  // For some reason an array of lighthouse Markers were not displaying
  /*
  useEffect(()=> {
    const tempLighthousesData: LighthouseMarker[] = [];
    SWFinlandLighthousesGeoJSON?.features.map((lighthouse: any) => {
      tempLighthousesData.push({
        latitude: lighthouse.geometry.coordinates[1],
        longitude: lighthouse.geometry.coordinates[0],
        range: (lighthouse?.properties['seamark:light:range']) ?? ((lighthouse?.properties['seamark:light:1:range']) ?? 1)
      })
    });
    setSWFinlandLighthouses(tempLighthousesData);
  }, [SWFinlandLighthousesGeoJSON]);

  const lighthouseMarkers = useMemo(() => {
    SWFinlandLighthouses.map((lighthouse, index) => {
      if(lighthouse.latitude && lighthouse.latitude) {
        <Marker
          key={"lighthouse_" + index}
          latitude={lighthouse.latitude}
          longitude={lighthouse.longitude}
          >
            <img src={require('./lighthouseIcon.png')} height={"50px"}  />
        </Marker>
      }
    })
  }, [SWFinlandLighthouses]);
  */


  return ( <Fragment>
      {odinNotFound && (
        <ErrorMessage/>
      )}
      {!odinNotFound && loading && (
        <Loading />
      )}
      {!odinNotFound && !loading && SARImageUrl && (
        <MapGL
          mapboxAccessToken={configData.MAPBOX_TOKEN}
          initialViewState={viewport}
          style={{width: "100vw", height: "100vh"}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          <Source
            type="image"
            url={SARImageUrl}
            coordinates={SARImageCoordinates} >
              <Layer {...sarImageLayerStyle} />
          </Source>
          
          <Source
            type="geojson"
            data={SWFinlandLighthousesGeoJSON}
            >
              <Layer {...lighthousesRangeLayerStyle} />
          </Source>
          <Source
            type="geojson"
            data={SWFinlandLighthousesGeoJSON}
            >
              <Layer {...lighthousesLayerStyle} />
          </Source>
          {/*lighthouseMarkers*/}
          <Marker 
            key="ship"
            latitude={currentShipLocationMarker.latitude}
            longitude={currentShipLocationMarker.longitude}
            anchor="bottom"
            >
              <img src={require('./shipPin.png')} height={"50px"}  />
          </Marker>
          <NavigationControl />
          <ScaleControl />
        </MapGL>
      )
      }
    </Fragment>
  );
}

