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

let dataToDisplay = []

// Processes JS object into final format by calling itself recursively until all data is processed.
const prepareData = (data, index) => {
    console.log(data.length, index)
    if (index < data.length) {
        let name = pathOr('no data', ['name'], data[index])
        let responses =  pathOr('no data', ['questions', 0, 'survey_responses'], data[index])
        let description = pathOr('no data', ['questions', 0, 'description'], data[index])
        let results = 0
        let count = 0
        if (responses !== 'no data') {
            responses.forEach((x) => {if (x.response_content !== "") results += parseInt(x.response_content), count++})
        }
        let dataObj = {
            name: name,
            description: description,
            average: results/count,
            accessor: index
        }
        dataToDisplay.push(dataObj)
        prepareData(data, index + 1)
    }
    else {
        console.log(dataToDisplay)
        return data
    }
    return data
}

// Reads in data, parses it into JS object, uses helper functions to prepare data for display, and sends to route middleware.
export function readAndProcessData(dir, survey) {
    return new Promise((resolve, reject) => {
        fs.readFile(dir, `utf-8`, (err, data) => {
            if (err) return reject(err)
            let parsedData = JSON.parse(data)
            let getData = pathOr('data not found', surveyPath(survey))
            let result = getData(parsedData)
            let finalResult = prepareData(result, 0)
            return resolve(finalResult)
        })
    })
}

