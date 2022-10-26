import React from 'react'
import {DatePicker} from 'react-responsive-datepicker'
import $ from 'jquery'
import './../Calendar.css'
export default function Calendar(props)
{
    let [rows, setRows] = React.useState()

    React.useEffect(()=>
    {
        let dater = new Date()
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
        let length = overArray[overArray.length-1].length
        while(length < 7)
        {
            overArray[overArray.length-1].push(null)
            length++
        }
        
        setRows(overArray)
    }, [])
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
    
    return (
        <div id='calendarGrid'>
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
