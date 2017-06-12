module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as JD exposing (list, string)
import Json.Decode.Pipeline as JDP
import List.Extra exposing (last)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { survey : String
    , retrievedData :
        { main : List SurveyData
        , survey1 : List SurveyData
        , survey2 : List SurveyData
        }
    }


type alias SurveyData =
    { name : String
    , description : String
    , average : String
    }


init : ( Model, Cmd Msg )
init =
    ( { survey = "survey"
      , retrievedData =
            { main = [ initialSurvey ]
            , survey1 = [ initialSurvey ]
            , survey2 = [ initialSurvey ]
            }
      }
    , getSurveyResults "survey"
    )


initialSurvey : { average : String, description : String, name : String }
initialSurvey =
    { average = "", description = "", name = "" }



-- UPDATE


type Msg
    = ChangeSurveyView String
    | GetNewSurveyData (Result Http.Error (List SurveyData))
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeSurveyView survey ->
            if (model.retrievedData |> dataToShow survey) == [ initialSurvey ] then
                ( { model | survey = survey }, getSurveyResults survey )
            else
                { model | survey = survey } ! []

        GetNewSurveyData (Ok data) ->
            let
                currentData =
                    model.retrievedData

                newData =
                    case model.survey of
                        "survey" ->
                            { currentData | main = data }

                        "survey/1" ->
                            { currentData | survey1 = data }

                        "survey/2" ->
                            { currentData | survey2 = data }

                        _ ->
                            { currentData | main = data }
            in
                { model | retrievedData = newData } ! []

        GetNewSurveyData (Err err) ->
            ( model, Cmd.none )

        NoOp ->
            model ! []



-- VIEW


view : Model -> Html Msg
view model =
    div []
        [ h2 [ class "title" ] [ text <| surveyTitle model.survey ]
        , div [ class "subtitle" ] [ text <| surveySubtitle model ]
        , div [ class "button-group-container" ]
            (List.map2 surveyButton model.retrievedData.main [ "survey/1", "survey/2" ])
        , div [ class "survey-group-container" ]
            (List.map surveyDiv (model.retrievedData |> dataToShow model.survey))
        ]


{-| Renders HTML of each question, description, answer.
-}
surveyDiv : SurveyData -> Html Msg
surveyDiv data =
    let
        survey =
            if data.name == "Simple Survey" then
                ChangeSurveyView "survey/1"
            else if data.name == "Acme Engagement Survey" then
                ChangeSurveyView "survey/2"
            else
                NoOp

        margin =
            if data.name == "Simple Survey" || data.name == "Acme Engagement Survey" then
                "100px"
            else
                "15px"
    in
        div [ class "survey-results", onClick survey, style [ ( "marginTop", margin ) ] ]
            [ div [ class "survey-results--name" ] [ text <| removeQuotes <| toString data.name ]
            , div [ class "survey-results--description" ] [ text <| removeQuotes <| toString data.description ]
            , div [ class "survey-results--average" ] [ text <| removeQuotes <| toString data.average ]
            , ratingCircleGroup (removeQuotes <| toString data.average)
            ]


surveyTitle : String -> String
surveyTitle survey =
    case survey of
        "survey/1" ->
            "Simple Survey"

        "survey/2" ->
            "Acme Engagement Survey"

        _ ->
            "Select Survey"


{-| Renders the participant count and response rate per survey.
-}
surveySubtitle : Model -> String
surveySubtitle model =
    let
        data =
            model.retrievedData.main

        a =
            Maybe.withDefault initialSurvey <| List.head data

        b =
            Maybe.withDefault initialSurvey <| last data
    in
        case model.survey of
            "survey/1" ->
                a.description ++ " : " ++ a.average

            "survey/2" ->
                b.description ++ " : " ++ b.average

            _ ->
                ""


{-| Buttons
-}
surveyButton : { a | name : String } -> String -> Html Msg
surveyButton a survey =
    div [ class "button--nav", onClick <| ChangeSurveyView survey ] [ text a.name ]


{-| Removes quotes ("") from strings.
-}
removeQuotes : String -> String
removeQuotes text =
    String.dropLeft 1 text
        |> String.dropRight 1


{-| Selects the data to display based on the survey selected.
-}
dataToShow : String -> { b | survey1 : a, survey2 : a, main : a } -> a
dataToShow text =
    case text of
        "survey" ->
            .main

        "survey/1" ->
            .survey1

        "survey/2" ->
            .survey2

        _ ->
            .main


{-| The circles that comprise the graphical rating score.
-}
ratingCircles : String -> Html msg
ratingCircles num =
    div
        [ style
            [ ( "height", "10px" )
            , ( "width", "10px" )
            , ( "margin", "5px 1px" )
            , ( "border", "1px solid #222" )
            , ( "borderRadius", "5px" )
            , ( "backgroundImage", "linear-gradient(90deg, red " ++ num ++ "%, rgba(0,0,0,0.75) " ++ num ++ "%)" )
            ]
        ]
        []


{-| Based on the score of each survey answer, this function "draws" the color in the rating circles
-}
ratingCircleGroup : String -> Html msg
ratingCircleGroup num =
    let
        percent =
            String.slice 2 3 num
                |> String.toInt
                |> Result.withDefault 0
                |> (*) 10
                |> toString

        list =
            case (String.slice 1 2 <| toString num) of
                "1" ->
                    [ "100", percent, "0", "0", "0" ]

                "2" ->
                    [ "100", "100", percent, "0", "0" ]

                "3" ->
                    [ "100", "100", "100", percent, "0" ]

                "4" ->
                    [ "100", "100", "100", "100", percent ]

                "5" ->
                    [ "100", "100", "100", "100", "100" ]

                _ ->
                    []
    in
        div [ class "rating-circles" ]
            (List.map ratingCircles list)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- HTTP


getSurveyResults : String -> Cmd Msg
getSurveyResults survey =
    let
        url =
            "http://localhost:3501/server/" ++ survey

        request =
            Http.get url surveyListDecoder
    in
        Http.send GetNewSurveyData request


surveyDecoder : JD.Decoder SurveyData
surveyDecoder =
    JDP.decode SurveyData
        |> JDP.required "name" JD.string
        |> JDP.required "description" JD.string
        |> JDP.required "average" JD.string


surveyListDecoder : JD.Decoder (List SurveyData)
surveyListDecoder =
    JD.list surveyDecoder
