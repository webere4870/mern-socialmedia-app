export default async function fetchRequest(endpoint, options)
{
    let response = await fetch(`http://localhost:5000/${endpoint}`, options)
    let json = await response.json()
    return json
}