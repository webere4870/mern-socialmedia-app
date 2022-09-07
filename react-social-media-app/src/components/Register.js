import React from 'react'
import Nav from './Nav'
import Form from './Form'

export default function Register(props)
{
    return (
    <div className='App'>
        <Nav/>
        <Form page={"register"}/>
    </div>)
}