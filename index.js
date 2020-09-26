'use strict'

const searchUrl = "https://developer.nps.gov/api/v1/parks?"
let all = ''
const apiKey = "VdqOupKkaB6Xec8sdloSahpIW90t0bDcxleeYO9B"
let i = 0

const queryParams = {
    limit: 10,
    api_key: apiKey,
    stateCode: []
}


function formatQueryParams(){
    const queryItems = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    console.log(queryItems)
    queryItems[queryItems.length] = "stateCode=" + String(queryParams.stateCode[0])
    for (i = 1; i < queryParams.stateCode.length; i++){
        queryItems.push("stateCode=" + String(queryParams.stateCode[i]))
    }
  return queryItems.join('&');
}

function getParksList() {
    console.log(queryParams.stateCode);
    const queryString = formatQueryParams()
    const url = searchUrl + queryString
    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(responseJson => 
        displayResults(responseJson))
      .catch(error => alert('Something went wrong. Try again later.')); //disable this for debugging
}
  
function displayResults(responseJson) {
    console.log(responseJson)
    all = responseJson
    console.log(all)    
    //unhides the results list
    $('.results').removeClass('hidden')

    //finds out how many times to iterate
    let totalToPrint = 0;
    if (parseInt(responseJson.limit) < parseInt(responseJson.total)){
        totalToPrint = responseJson.limit
    }
    else{
        totalToPrint = responseJson.total
    }
    console.log(totalToPrint)

    //adds the results to the empty list
    for (i = 0; i < totalToPrint; i++){
        //console.log(responseJson.data[i].addresses[0].line1)
        if (responseJson.data[i].addresses.length === 0){
            $('ul').append(`<li class="result-entry">${responseJson.data[i].fullName}<br><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a><br><p>${responseJson.data[i].description}</p></li>`)
        }
        else if (responseJson.data[i].addresses[0].line2.length === 0){
            $('ul').append(`<li class="result-entry">${responseJson.data[i].fullName}<br><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a><br><p>${responseJson.data[i].description}</p><br>${responseJson.data[i].addresses[0].line1}<br>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</li><br>`)
        }
        else{
            $('ul').append(`<li class="result-entry">${responseJson.data[i].fullName}<br><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a><br><p>${responseJson.data[i].description}</p><br>${responseJson.data[i].addresses[0].line1}<br>${responseJson.data[i].addresses[0].line2}<br>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</li><br>`)
        }
        console.log(responseJson.data[i].fullName)
    }
}
  
function watchForm() {
    $('form').submit(event => {
        event.preventDefault()
        //this empties the list so a new list can be displayed
        $('ul').empty()
        queryParams.stateCode = []   
        //this finds the user entry and sends it to the functions
        let states = $(event.currentTarget).find('#user-entry').val()
        let statesNum = ((states.length - 2)/4) +1;
        console.log(statesNum)
        for (i = 0; i < statesNum; i++){
            queryParams.stateCode[i] = states[0] + states[1]
            states = states.replace(String(queryParams.stateCode[i] +', '),'')
            console.log(states)
        }
        //queryParams.stateCode = $(event.currentTarget).find('#user-entry').val()
        queryParams.limit = $(event.currentTarget).find('#num-results').val()
        getParksList()
    }); //find # responses in this fnct?
}
  
$(function() {
    console.log('App loaded, waiting for submit.')
    watchForm()
});