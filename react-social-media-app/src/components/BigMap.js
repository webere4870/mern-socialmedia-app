import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();

export default function BigMap(props)
{   

    let mapCenter=props.mapCenter 
    
    return (
        <div id='searchMap'>
            <SearchMap center={mapCenter}/>
        </div>
 )
}