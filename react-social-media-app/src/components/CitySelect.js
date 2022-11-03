import React from "react";
import { Country, State, City } from "country-state-city";


export default function CitySelect(props)
{
    let {filterValues, setFilterValues} = props
    let [cities, setCities] = React.useState([])

    function selectCity(evt)
    {
        console.log("Hera")
        let val = evt.currentTarget.value
        console.log(val)
        setFilterValues((prev)=>
        {
            return {...prev, 'city': val}
        })
    }

    React.useEffect(()=>
    {
        let cityArr = City.getCitiesOfState("US", filterValues.state)
        setCities(cityArr)
    }, [])
    console.log(filterValues)
    let cityMap = cities?.map((temp)=>
    {
        if(temp.name == filterValues.city)
        {
            console.log(temp)
            return (<option selected value={temp.name}>
            {temp.name} 
            </option>)
        }
        else{
            return (<option value={temp.name}>
            {temp.name} 
            </option>)
        }
    })

    return (
    <div id="cityBlock" className="filterTile">
        <select id="citySelect" value={filterValues.city} onChange={selectCity}>
            {cityMap}
        </select>
    </div>)
}