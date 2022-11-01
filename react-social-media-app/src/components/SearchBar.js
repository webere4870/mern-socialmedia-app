import React from 'react'
import "./../SearchBar.css"
import Geocode from 'react-geocode'
import {Link} from "react-router-dom"
import SearchContext from './SearchContext'
import './../Chat.css'


export default function SearchBar(props)
{
    let [inputData, setInputData] = React.useState("")
    let [isValidAddress, setIsValidAddress] = React.useState(false)
    let [lat, setLat] = React.useState(0)
    let [lng, setLng] = React.useState(0)
    let [city, setCity] = React.useState("")
    let [state, setState] = React.useState("")
    let [searchValue, setSearchValue] = React.useContext(SearchContext)

    const queryParams = new URLSearchParams(window.location.search)
    console.log(window.location.search)
    function setData(evt)
    {
        let value = evt.currentTarget.value
        Geocode.fromAddress(value).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                setLat(lat)
                setLng(lng)
                Geocode.fromLatLng(lat, lng).then(
                    (response) => {
                      const address = response.results[0].formatted_address;
                      let city, state, country;
                      for (let i = 0; i < response.results[0].address_components.length; i++) {
                        for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                          switch (response.results[0].address_components[i].types[j]) {
                            case "locality":
                              city = response.results[0].address_components[i].long_name;
                              setCity(city)
                              break;
                            case "administrative_area_level_1":
                              state = response.results[0].address_components[i].long_name;
                              setState(state)
                              break;
                            case "country":
                              country = response.results[0].address_components[i].long_name;
                              break;
                          }
                        }
                      }
                      console.log(city, state, country);
                      console.log(address);
                    },
                    (error) => {
                      console.error(error);
                    }
                  );
              setIsValidAddress(true)
            },
            (error) => {
              setIsValidAddress(false)
            }
        );
        setInputData(value)
    }
    console.log(isValidAddress)

    function Navigator()
    {
        if(isValidAddress)
        {
            return (<Link to={`/search?city=${city}&state=${state}&lat=${lat}&lng=${lng}`}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-search corner" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg></Link>)
        }
        else if(inputData)
        {
                return (<Link to={`/userSearch?user=${inputData}`}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" onClick={()=>setSearchValue(inputData)} className="bi bi-search corner" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg></Link>)
        }
        else
        {
            return <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-search corner" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        }
    }

    return(
    <div className='colFlex'>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous"/>
        <div id='searcher'>
        <div className="search">
        <input type="search" className="round"  onChange={(evt)=> setData(evt)} value={inputData} placeholder='Address, Name, Username' required/><Navigator/>
        </div>
        </div>
        
        
        

    </div>)
}