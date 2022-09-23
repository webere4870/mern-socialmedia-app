import React from 'react'

export default function SlideShow(props)
{
    let [index, setIndex] = React.useState(0)
    let [divStyle, setDivStyle] =React.useState()
    let [center, setCenter] =React.useState("center")
    let firstArr = []
    for(let counter = 0; counter < props?.pictures?.length; counter++)
    {
        if(counter == 4)
        {
            break
        }
        firstArr.push(counter)
    }
    let [shiftArray, setShiftArray] = React.useState(firstArr)

    console.log(firstArr)

    React.useEffect(()=>
    {
        setDivStyle((prev)=>
        {
            return {backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props?.pictures?.[index]})`}
        })
    }, [index])

    React.useEffect(()=>
    {
        setShiftArray((prev)=>
        {
            let starter = index
            let newArr = [index]
            for(let counter = 1; counter < 4; counter++)
            {
                starter++
                if(counter == props?.pictures?.length)
                {
                    break
                }
                if(starter < props?.pictures?.length)
                {
                    newArr.push(starter)
                }
                else
                {
                    newArr.push(0)
                    starter = 0
                }
                
            }
            return newArr
        })
    }, [])


    function changeSlide(changer)
    {
        setIndex((prev)=>
        {
            let newIndex = prev + changer
            if(newIndex < 0)
            {
                newIndex = props.pictures.length - 1
            }
            else if(newIndex >= props?.pictures?.length)
            {
                newIndex = 0
            }
            updateSubs(newIndex)
            return newIndex
        })
    }

    function updateSubs(newIndex)
    {
        setShiftArray((prev)=>
        {
            let starter = newIndex
            let newArr = [index]
            for(let counter = 1; counter < 4; counter++)
            {
                starter++
                if(counter == props?.pictures?.length)
                {
                    break
                }
                if(starter < props?.pictures?.length)
                {
                    newArr.push(starter)
                }
                else
                {
                    newArr.push(0)
                    starter = 0
                }
                
            }
            return newArr
        })
    }

    return (
    <div id="slideshow">
        <div id="slideshow-container" style={divStyle}>
            <svg onClick={()=>changeSlide(-1)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
            </svg>
            <div class="numbertext">{index + 1} / {props?.pictures?.length}</div>
            <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>changeSlide(1)}  width="24" height="24" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>
        </div>
        <div id="ssRow">
            {shiftArray?.length>0 && <div className='subImage' style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props.pictures?.[shiftArray[0]]})`}}></div>}
            {shiftArray?.length>1 && <div className='subImage'  style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props.pictures?.[shiftArray[1]]})`}}></div>}
            {shiftArray?.length>2 && <div className='subImage'  style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props.pictures?.[shiftArray[2]]})`}}></div>}
            {shiftArray?.length>3 && <div className='subImage'  style={{backgroundImage: `url(https://webere4870.blob.core.windows.net/react-app/${props.pictures?.[shiftArray[3]]})`}}></div>}
        </div>
    </div>)
}