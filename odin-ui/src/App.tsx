import './App.css';
import { Fragment, useState, useEffect } from 'react';
import MapGL, {Source, Layer, LayerProps} from 'react-map-gl';

import Loading from './components/Loading';
import { Viewport } from './models/nauvo';
import { GetSARImageNauvo, GetSARImageNauvoCoordinates } from './routes/nauvo';
import configData from "./config.json";

const SARImageCoordinates = [
  [22.2908182629724, 59.91614254645401],
  [22.578806773313246, 59.947751078236365],
  [22.638044070378744, 59.809992490984754],
  [22.351391574531174, 59.77847599974091],
];


const layerStyle: LayerProps = {
  id: 'SAR_image_layer',
  type: 'raster'
};

const ErrorMessage = () => {
  return (
      <div className="error-message-container">
        <h1 className="error-message">
        ERROR 404 - ODIN NOT FOUND
        </h1>
      </div>
  );
};

/*
const OdinApp = (viewport: Viewport) => {
  return (
    <Map initialViewState={viewport} ></Map>
  );
};
*/

export const App = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [odinNotFound, setOdinNotFound] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 59.8613,
    longitude: 22.4673,
    zoom: 11.25
  });
  const [SARImageUrl, setSARImageUrl] = useState<string>('');
  const [SARImageCoordinates, setSARImageCoordinates] = useState([]);

  useEffect(() => {
    const getSARImageNauvo = async() => {
      setLoading(true);
      GetSARImageNauvo().then((response) => {
        setOdinNotFound(false);
        setSARImageUrl(response.request.responseURL);
        getSARImageNauvoCoordinates();
      }).catch((error) => {
        setOdinNotFound(true);
        setLoading(false);
      })
    }

    const getSARImageNauvoCoordinates = async() => {
      GetSARImageNauvoCoordinates().then((response) => {
        setSARImageCoordinates(response.data.nauvo_image);
        
        setLoading(false);
      }).catch((error) => {
        
        setOdinNotFound(true);
        setLoading(false);
      })
    }

    getSARImageNauvo();
  }, []);


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
              <Layer {...layerStyle} />
          </Source>
        </MapGL>
      )
      }
    </Fragment>
  );
}

