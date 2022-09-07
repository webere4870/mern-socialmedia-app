import React from 'react'
import Nav from './Nav'
import Form from './Form'


export default function Login(props)
{
    return (
    <div className='App'>
        <Nav/>
        <Form page={"login"}/>
    </div>)
}