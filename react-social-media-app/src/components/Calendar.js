import React from 'react'
import {DatePicker} from 'react-responsive-datepicker'
import $ from 'jquery'
import './../Calendar.css'
import DateContext from './DateContext'
export default function Calendar(props)
{
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let [rows, setRows] = React.useState()
    let [currentDate, setCurrentDate] = React.useContext(DateContext)

    function newDate(diffy)
    {
        let dateObj
        if(currentDate)
        {
            dateObj = currentDate
        }
        console.log(currentDate)
        dateObj.setMonth(dateObj.getMonth() + diffy)
        setCurrentDate(new Date(dateObj))
    }
    console.log(currentDate)
    React.useEffect(()=>
    {
        setCurrentDate(new Date())
    }, [])
    React.useEffect(()=>
    {
        let dater = currentDate ? new Date(currentDate) : new Date()
        let month = Number(dater?.getMonth())
        let days = 1
        let overArray = []
        dater?.setDate(1)
        let iteration =0
        while(dater?.getMonth() == month)
        {
            console.log(dater?.getMonth())
            let underArray = []
            if(iteration == 0)
            {
                let day = dater?.getDay()
                console.log(day)
                for(let counter = 0; counter < 7-(7-day); counter++)
                {
                    underArray.push(null)
                }
                console.log("Underarray",underArray)
            }
            iteration++
            do
            {
                underArray.push(dater?.getDate())
                dater?.setDate(dater?.getDate()+1)
                console.log(dater)
            }while(dater?.getDay() != 0 && dater?.getMonth() == month)
            overArray.push(underArray)
        }
        let length = overArray?.[overArray.length-1]?.length
        while(length < 7)
        {
            overArray[overArray.length-1].push(null)
            length++
        }
        setRows(overArray)
    }, [currentDate])
    let rowLengthNeed = rows?.length
    let calendarMap = rows?.map((arr, index)=>
    {
        let div
        div = 
        <div className='calendarRow'>
            {arr?.map((date)=><p>{date}</p>)}
        </div>

        return div
    })
    let indexer = currentDate?.getMonth()
    
    let monther = months.filter((temp, index)=>
    {
        return index == indexer
    })
    return (
        <div id='calendarGrid'>
            <div className='rowFlex' style={{justifyContent: "space-between", width: "100%"}}>
                {/* <div className="circleSVG">
                    <svg onClick={(evt)=>newDate(-12)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-double-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </div> */}

                <div className="circleSVG">
                    <svg onClick={(evt)=>newDate(-1)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                    </svg>
                </div>
                <h4>{monther} {currentDate?.getYear() + 1900}</h4>
                <div className="circleSVG">
                    <svg onClick={(evt)=>newDate(1)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
                    </svg>
                </div>
                {/* <div className="circleSVG">
                    <svg onClick={(evt)=>newDate(12)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                    <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </div> */}
                
            </div>
          <div className="calendarRow">
            <p>Su</p>
            <p>Mo</p>
            <p>Tu</p>
            <p>We</p>
            <p>Th</p>
            <p>Fr</p>
            <p>Sa</p>
          </div>
          {calendarMap}
        </div>
      )
}
