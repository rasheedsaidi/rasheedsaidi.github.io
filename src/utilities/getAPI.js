export default (url) => {
    return fetch(url)
    .then(response => response.json() ) // parses response to JSON 
}