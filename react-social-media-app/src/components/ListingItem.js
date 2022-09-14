import React from 'react'


export default function ListingItem(props)
{
    let {address, city, state, ZIP, price, owner, pictures} = props.listing
    let {setSideToggle, setSelected} = props
    function toggleSideScreen(evt)
    {
        setSideToggle((prev)=>
        {
            return !prev
        })

        setSelected((prev)=>
        {
            return props.listing
        })
    }
    return(<div class="card">
    <div class="card-header">
      <img src={`https://webere4870.blob.core.windows.net/react-app/${pictures[0]}`} alt="" />
    </div>
    <div class="card-body">
      <span class="tag tag-teal">Technology</span>
      <h4>2 bedrooms, 1 bath</h4>
      <p>
        {address},
        {`${city}, ${state} ${ZIP}`}
      </p>
      <button onClick={toggleSideScreen}>See More</button>
      <div class="user">
        <img src={`https://webere4870.blob.core.windows.net/react-app/${owner}`} alt="" />
        <div class="user-info">
          <h5>{owner}</h5>
          <small>2h ago</small>
        </div>
      </div>
    </div>
  </div>)
}