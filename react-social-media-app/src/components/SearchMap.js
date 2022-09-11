import React from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
const Map = (props) => {

    
    const [ selected, setSelected ] = React.useState({});
    const [locations, setLocations] = React.useState([])
  const onSelect = item => {
    setSelected(item);
  }
  React.useEffect(()=>
    {
        setLocations((prev)=>
        {
            return [
                {
                  name: "Location 2=1",
                  location: { 
                    lat: 41.3954,
                    lng: 2.162 
                  },
                },
                {
                  name: "Location 27",
                  location: { 
                    lat: 41.3917,
                    lng: 2.1649
                  },
                },
                {
                  name: "Location 3",
                  location: { 
                    lat: 41.3773,
                    lng: 2.1585
                  },
                },
                {
                  name: "Location 4",
                  location: { 
                    lat: 41.3797,
                    lng: 2.1682
                  },
                },
                {
                  name: "Location 5",
                  location: { 
                    lat: 41.4055,
                    lng: 2.1915
                  },
                },
                {
                    name: "Location 6",
                    location: { 
                      lat: 41.4055,
                      lng: 2.1915
                    },
                  }
              ];
        })
    }, [])
  const mapStyles = {        
    height: "100%",
    width: "100%"};
  
  const defaultCenter = {
    lat: 41.4055, lng: 2.1915
  }
  let mappers = locations.map(item => {
    return (
    <MarkerF key={item.name} 
      position={item.location}
      onClick={() => onSelect(item)}
    />
    )
  })
  
  return (
     <LoadScript
       googleMapsApiKey='AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={props.center}>
         {
            mappers
         }
        {
            selected.location && 
            (
              <InfoWindow
              position={selected.location}
              clickable={true}
              onCloseClick={() => setSelected({})}
            >
              <p>{selected.name}</p>
            </InfoWindow>
            )
         }
     </GoogleMap>
     </LoadScript>
  )
}

export default Map;