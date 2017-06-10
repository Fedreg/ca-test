module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as JD exposing (list, string)
import Json.Decode.Pipeline as JDP


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
    , retrievedData : List SurveyData
    }


type alias SurveyData =
    { name : String
    , description : String
    , average : String
    }


init : ( Model, Cmd Msg )
init =
    { survey = "survey"
    , retrievedData = [ { average = "", description = "", name = "" } ]
    }
        ! []



-- UPDATE


type Msg
    = ChangeSurveyView String
    | DisplayData (List SurveyData)
    | GetNewSurveyData (Result Http.Error (List SurveyData))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeSurveyView survey ->
            ( { model | survey = survey }, getSurveyResults model.survey )

        DisplayData data ->
            { model | retrievedData = data } ! []

        --do a case statement to update view on survey change
        -- ( model, getSurveyResults model.survey )
        GetNewSurveyData (Ok data) ->
            { model | retrievedData = data } ! []

        GetNewSurveyData (Err err) ->
            let
                _ =
                    Debug.log "error" (Err err)
            in
                ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    div [ style [ ( "backgroundColor", "#222" ) ] ]
        [ h2 [] [ text model.survey ]
        , button [ onClick <| ChangeSurveyView "survey" ] [ text "Main Survey" ]
        , button [ onClick <| ChangeSurveyView "survey/1" ] [ text "Survey 1" ]
        , button [ onClick <| ChangeSurveyView "survey/2" ] [ text "Survey 2" ]
          -- , button [ onClick <| GetNewSurveyData (Ok model.retrievedData) ] [ text "Get Data" ]
        , div []
            (List.map surveyDiv model.retrievedData)
        ]


surveyDiv : SurveyData -> Html msg
surveyDiv data =
    div []
        [ div [ style [ ( "color", "blue" ) ] ] [ text <| toString data.name ]
        , div [ style [ ( "color", "deepPink" ) ] ] [ text <| toString data.description ]
        , div [ style [ ( "color", "red" ), ( "marginBottom", "25px" ) ] ] [ text <| toString data.average ]
        ]



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



-- decodeSurveyData : JD.Decoder String
-- decodeSurveyData =
--     JD.list


surveyDecoder : JD.Decoder SurveyData
surveyDecoder =
    JDP.decode SurveyData
        |> JDP.required "name" JD.string
        |> JDP.required "description" JD.string
        |> JDP.required "average" JD.string


surveyListDecoder : JD.Decoder (List SurveyData)
surveyListDecoder =
    JD.list surveyDecoder
