import React from 'react'
import Nav from './Nav'
import queryString from 'query-string'
import Fetch from './../utils/fetch'
import UserCard from './UserCard'
import SearchContext from './SearchContext'

export default function UserListings(props)
{
    let [userList, setUserList] = React.useState([])
    let [searchValue, setSearchValue] = React.useContext(SearchContext)
    let {user} = queryString.parse(window.location.search)
    React.useEffect(()=>
    {
        Fetch("searchUsers?user="+searchValue, {method: "GET"}).then((response)=>
        {
            setUserList((prev)=>
            {
                return [...response.users]
            })
        })
    }, [searchValue])

    console.log(userList)

    let userArray = userList?.map((temp)=>
    {
        return <UserCard user={temp} key={temp.username}/>
    })

    return (
    <div className='App'>
        <Nav/>
        <div id='userList'>
            {userArray}
        </div>
    </div>)
}