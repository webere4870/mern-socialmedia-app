import React from 'react'
import "./../SearchBar.css"
import Geocode from 'react-geocode'
import {Link} from "react-router-dom"
import SearchContext from './SearchContext'


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
            return (<Link to={`/search?city=${city}&state=${state}&lat=${lat}&lng=${lng}`}><i class="fa fa-search"></i></Link>)
        }
        else if(inputData)
        {
                return (<Link to={`/userSearch?user=${inputData}`}><i class="fa fa-search" onClick={()=>setSearchValue(inputData)}></i></Link>)
        }
        else
        {
            return <i class="fa fa-search"></i>
        }
    }

    return(
    <div className='colFlex'>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous"/>
        <form action="" id='former'>
        <input type="search"  onChange={(evt)=> setData(evt)} value={inputData} placeholder='Address, Name, Username' required/>
        <Navigator/>
        

        </form>
    </div>)
}