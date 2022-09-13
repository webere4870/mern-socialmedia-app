import React from 'react'


export default function ListingItem(props)
{
    let {address, city, state, ZIP, price, owner} = props.listing
    return(<div className='listing'>
        <h4>{`${address} ${city} ${state} ${ZIP} $${price} ${owner}`}</h4>
        <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} style={{height: "60px", width: "60px", borderRadius: "50%"}} alt="" />
    </div>)
}