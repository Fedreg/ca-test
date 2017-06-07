import fs from 'fs'
import path from 'path'
import { pathOr } from 'ramda'

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
    
export function readAndProcessData(dir, survey) {
    return new Promise((resolve, reject) => {
        fs.readFile(dir, `utf-8`, (err, data) => {
            if (err) return reject(err)
            let parsedData = JSON.parse(data)
            let dataMiner = pathOr('not found', surveyPath(survey))
            const result = dataMiner(parsedData)
            return resolve(result)
        })
    })
}

