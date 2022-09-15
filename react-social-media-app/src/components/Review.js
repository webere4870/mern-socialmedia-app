import React from 'react'

export default function Review(props)
{
    let {setComment} = props

    async function changeForm(evt)
    {
        let name = evt.currentTarget.name
        let value = evt.currentTarget.value
        setComment((prev)=>
        {
            return {...prev, [name]: value}
        })
    }
    return (
        <div className="container my-5 py-5 text-dark">
          <div className="row d-flex justify-content-center">
            <div className="col-md-11 col-lg-9 col-xl-7">
      
              <div className="d-flex flex-start">
                <img className="rounded-circle shadow-1-strong me-3"
                  src={`https://webere4870.blob.core.windows.net/react-app/${props?.commentObject?.username}`} alt="avatar" width="65"
                  height="65" />
                <div className="card w-900">
                  <div className="card-body p-4">
                    <div className="">
                      <h5>{props?.commentObject?.username}</h5>
                      {props.stars ? <div style={{margin: "20x 0"}}>{props.stars}</div>  : <p className="small">5 hours ago</p>}
                      {props.edit && 
                      <input type="text" name="comment" value={props.comment.comment} onChange={changeForm} style={{width: "100%"}}/>
                        }
                      {!props.edit && <p>
                        {props?.commentObject?.comment}
                      </p>}
      
                      {props.edit && <button onClick={props.submitForm}>Submit</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}