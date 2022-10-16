import React from 'react'

export default function ToolTip({children})
{
    console.log(children)
    return (
    <div className='toolTip'>
        {children}
    </div>)
}