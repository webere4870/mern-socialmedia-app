import React from 'react'
import './../UserCard.css'

export default function UserCard(props)
{
    let {name, _id, city, state, overall} = props.user
    return (
    <div class="outer-div">
        <div class="inner-div">
          <div class="front">
            <div class="front__bkg-photo"></div>
            <div class="front__face-photo" style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${_id})`}}></div>
            <div class="front__text">
              <h3 class="front__text-header">{name}</h3>
              <p class="front__text-para"><i class="fas fa-map-marker-alt front-icons"></i>{city}, {state}</p>
              <div className="rowFlex">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <p>{overall}</p>
              </div>
              <span class="front__text-hover">Hover to Find Me</span>
            </div>
          </div>
          <div class="back">
            <div class="social-media-wrapper">
              <a href="#" class="social-icon"><i class="fab fa-codepen" aria-hidden="true"></i></a> 
              <a href="#" class="social-icon"><i class="fab fa-github-square" aria-hidden="true"></i></a>
              <a href="#" class="social-icon"><i class="fab fa-linkedin-square" aria-hidden="true"></i></a>
               <a href="#" class="social-icon"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            </div>
          </div>
      
        </div>
    </div>)
}