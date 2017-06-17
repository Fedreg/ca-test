import Mocha from 'mocha'
import Chai from 'chai'
import * as funcs from '../server/Utils/funcs.js'

let should = Chai.should()

describe('Utils.funcs', () => {

    it('SurveyPath should return an array of strings', () => {
        funcs.surveyPath("main").should.be.deep.equal(['survey_results'])
        funcs.surveyPath("1").should.be.deep.equal(['survey_result_detail', 'themes'])
        funcs.surveyPath("2").should.be.deep.equal(['survey_result_detail', 'themes'])
        funcs.surveyPath("random").should.be.deep.equal(['survey_results'])
    })

    it('Number formtter should return a 2 digit float', () => {
        funcs.numberFormatter(2.515151515151).should.equal('2.5')
    })

    it('Prepare Title Data should return an array', () => {
        funcs.prepareTitleData(sampleTitleData, []).should.be.deep.equal(
            [   
                {
                    "average": "Response rate: 83%",
                    "description": "6 participants",
                    "name": "Simple Survey"
                },
                {
                    "average": "Response rate: 100%",
                    "description": "271 participants",
                    "name": "Acme Engagement Survey"
                }
            ]
        )
    })

    // Make sure testing is working
    it('Sample test should equal 1', () => {
        (1).should.equal(1)
    })
})

//TODO  Need more Utils/funcs tests

describe('Routes', () => {

})

const sampleTitleData = [
    {
        "name": "Simple Survey",
        "url": "/survey_results/1.json",
        "participant_count": 6,
        "response_rate": 0.8333333333333334,
        "submitted_response_count": 5
    },
    {
        "name": "Acme Engagement Survey",
        "url": "/survey_results/2.json",
        "participant_count": 271,
        "response_rate": 1.0,
        "submitted_response_count": 271
    }
]

const sampleSurveyData = {
    "name": "The Work",
    "questions": [
        {
            "description": "I like the kind of work I do.",
            "question_type": "ratingquestion",
            "survey_responses": [
                {
                    "id": 1,
                    "question_id": 1,
                    "respondent_id": 1,
                    "response_content": "5"
                },
                {
                    "id": 6,
                    "question_id": 1,
                    "respondent_id": 2,
                    "response_content": "4"
                }
            ]
        }
    ]
}