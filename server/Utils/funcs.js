import fs from 'fs'
import path from 'path'
import {pathOr, map} from 'ramda'

// Returns a path to be used by Ramda.pathOr to retrieve data.
const surveyPath = (survey) => {
    switch (survey) {
        case "1" : 
            return ['survey_result_detail', 'themes'] 
            break
        case "2" : 
            return ['survey_result_detail', 'themes']
            break
        case "main" : 
            return ['survey_results']
            break
        default : 
            return ['survey_results']
    }
}

// Removes extra decimal spaces and rounds number. 
const numberFormatter = (num) => {
    if (String(num.toFixed(1)).slice(2) === "0") return String(num.toFixed(2).slice(0,1))
    else return String(num.toFixed(1))
}

// Determines which format data is returned in based on survey type.
const prepareData = (result, index, arr, survey) => {
    if (survey === 'main') return prepareTitleData(result, arr)
    else return prepareSurveyData(result, index, arr)
}

// Displays survey title information
const prepareTitleData = (result, arr) =>{
    let dataToDisplay = arr
    result.forEach((x) => {
        let name = x.name
        let description = String(x.participant_count)
        let average = String((x.response_rate * 100).toFixed(0))
        let dataObj = { 
            name:  name,
            description: description,
            average: average
        }
        dataToDisplay.push(dataObj)
    })
    return dataToDisplay
}

// Processes JS object into final format by calling itself recursively until all data is processed.
const prepareSurveyData = (data, index, arr) => {
    let dataToDisplay = arr
    let query = (path) => pathOr('no data', path, data[index]) // Func to retrieve data from JSON.  Ramda.
    let questions = query(['questions'])
    if (index < data.length) {
        for (let a = 0; a < questions.length; a++) { // Loops over questions to build up data obj to return.
            let name = query(['name'])
            let responses =  query(['questions', a, 'survey_responses'])
            let description = query(['questions', a, 'description'])
            let results = 0
            let count = 0
            if (responses !== 'no data') {
                responses.forEach((x) => {if (x.response_content !== "") results += parseInt(x.response_content), count++})
            }
            let dataObj = {
                name: name,
                description: description,
                average: numberFormatter(results/count)
            }
            dataToDisplay.push(dataObj)
        }
        prepareData(data, index + 1, dataToDisplay)
    }
    return dataToDisplay
}

// Reads in data, parses it into JS object, uses helper functions to prepare data for display, and sends to route middleware.
export function readAndProcessData(dir, survey) {
    return new Promise((resolve, reject) => {
        fs.readFile(dir, `utf-8`, (err, data) => {
            if (err) return reject(err)
            let parsedData = JSON.parse(data)
            let getData = pathOr('data not found', surveyPath(survey))
            let result = getData(parsedData)
            let finalResult = prepareData(result, 0, [], survey)
            return resolve(finalResult)
        })
    })
}
