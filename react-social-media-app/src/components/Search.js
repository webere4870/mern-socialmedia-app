import React from 'react'
import Nav from './Nav'
import SearchMap from './SearchMap'
import Geocode from 'react-geocode'
import BigMap from './BigMap'
import SearchForm from './SearchForm'

Geocode.setApiKey("AIzaSyBM30jMWwV1hwTHUTJcSijFCnu-3XcunUE");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.enableDebug();


export default function Search(props)
{
    let [mapCenter, setMapCenter] = React.useState({lat: 39.9612, lng: -82.9988})
    let [city, setCity] = React.useState("Findlay")
    let [state, setState] = React.useState("OH")
    let [error, setError] = React.useState("")

    function handleState(evt)
    {
        let namer = evt.currentTarget.name
        let val = evt.currentTarget.value
        namer == "state" ? setState(val) : setCity(val)
    }
    
    React.useEffect(()=>
    {
        Geocode.fromAddress(`${city}, ${state}`).then(
            (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              setMapCenter((prev)=>
              {
                return {lat: lat, lng:lng}
              })
            },
            (error) => {
              setError("City does not exist")
            }
        );
    }, [city, state])
    return (<div className='rowFlex'>
        <Nav/>
        <BigMap city={city} state={state} setCity={setCity} setState={setState} mapCenter={mapCenter} setMapCenter={setMapCenter}/>
        <SearchForm handleState={handleState} city={city} state={state}/>
    </div>)
}