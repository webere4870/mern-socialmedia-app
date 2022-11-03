import React from "react";
import $ from 'jquery'
import USAMap from "react-usa-map";

export default function StateSelect(props)
{

    let {filterValues, setFilterValues} = props
    console.log(filterValues)
    function clickHandler(evt)
    {
        console.log(evt.target)
        $(".selectedState").removeClass("selectedState")
        $(evt.target).addClass("selectedState")
        setFilterValues((prev)=>
        {
            return {...prev, ['state']: evt.target.dataset.name}
        })        
    }

    React.useEffect(()=>
    {
        if(filterValues.state)
        {
            $(`.${filterValues.state}`).addClass("selectedState")
        }
    })
    
    return (
        <div id="stateBlock" className="filterTile">
            <USAMap onClick={clickHandler} />
        </div>
        
    )
}