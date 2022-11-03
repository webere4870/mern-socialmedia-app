import React from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
const Map = (props) => {

    
    const [ selected, setSelected ] = React.useState({});
    const [locations, setLocations] = React.useState([])
  const onSelect = item => {
    setSelected(item);
  }
 
  const mapStyles = {        
    height: "100%",
    width: "100%"};
  
  let mappers = locations.map(item => {
    return (
    <MarkerF key={item.name} 
      position={item.location}
      onClick={() => onSelect(item)}
    />
    )
  })
  let mapStyless = [{
    featureType: "poi",
    elementType: "geometry",
    stylers: [
        {
            color: "#eeeeee",
        },
    ],
},
{
    featureType: "poi",
    elementType: "labels.text",
    stylers: [
        {
            visibility: "off",
        },
    ],
},
{
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
        {
            color: "#9e9e9e",
        },
    ],
},]
  return (
     
        <GoogleMap
        options={{
          styles: mapStyless
        }}
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
  )
}

export default Map;