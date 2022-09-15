import React from 'react'

export default function SlideShow(props)
{
    let [index, setIndex] = React.useState(0)
    let [divStyle, setDivStyle] =React.useState()
    let [center, setCenter] =React.useState("center")

    React.useEffect(()=>
    {
        setDivStyle((prev)=>
        {
            return {backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props.pictures[index]})`}
        })
    }, [index])

    function changeSlide(changer)
    {
        setIndex((prev)=>
        {
            let newIndex = prev + changer
            if(newIndex < 0)
            {
                newIndex = props.pictures.length - 1
            }
            else if(newIndex >= props.pictures.length)
            {
                newIndex = 0
            }
            return newIndex
        })
    }

    return (
    <div id="slideshow-container" style={divStyle}>
        <svg onClick={()=>changeSlide(-1)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
        </svg>
        <div class="numbertext">{index + 1} / {props.pictures.length}</div>
        {/* <img src={`https://webere4870.blob.core.windows.net/react-app/${props.pictures[index]}`} style={{width:"100%"}}/> */}
        <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>changeSlide(1)}  width="24" height="24" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
        </svg>
</div>)
}