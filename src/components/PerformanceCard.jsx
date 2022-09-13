import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { getAthleteAverageTime, getAthleteTime } from "../lib/athleteLibs";
import { getPredictionData, getPredictionMeetData } from "../lib/meetLibs";
import prevMeetIds from "../lib/prevMeetIds";
import { buildModel } from "../lib/regressionLibs";
import { secondsToReadable } from "../lib/timeLibs";
import { PhoneIcon } from "@chakra-ui/icons";
import config from "../config";

function PerformanceCard(props) {
    const { predIndex, selectedAthlete, season } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [cardData, setCardData] = useState({});

    const generatePrediction = (currentMeetId, currentSeason) => {
        setIsLoading(true);
        console.log("Generating prediction")
        if(prevMeetIds[currentSeason][currentMeetId]) {
            const meetId = prevMeetIds[currentSeason][currentMeetId];
            fetch(config.apiUrl + '/getMeetAthletes', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        meetId: meetId
                    })
                }).then((res) => res.json()).then((data) => {
                    let season;
                    let meetDate;
                    data[0].results.every((s) => {
                        const race = s.meets.find((m) => m.meetId == meetId);
                        if (race) {
                            season = s.season;
                            meetDate = (new Date(race.date)).valueOf();
                            return false;
                        }
                        return true;
                    });
                    const predictionData = getPredictionData(data, season, meetId, meetDate, "avg");

                    const meetDateCurr = new Date(meetDate);
                    meetDateCurr.setFullYear(currentSeason);
                    const avgTime = getAthleteAverageTime(selectedAthlete, currentSeason, meetDateCurr.valueOf());
                    // console.log(meetDateCurr.toDateString());
                    // console.log("avg time used for prediction is: ", avgTime);

                    const model = buildModel(predictionData);

                    const predictionSRData = getPredictionMeetData(data, season, {prevMeetId: meetId}, selectedAthlete.gender, false);
                    const timeOnCourse = getAthleteTime(selectedAthlete, currentSeason, currentMeetId);

                    const srModel = buildModel(predictionSRData);
                    if(model.points.length === 0) {
                        setCardData({});
                    } else {
                        setCardData({
                            model: model,
                            avgTime: avgTime,
                            meetDateCurr: meetDateCurr,
                            srModel: srModel,
                            timeOnCourse: timeOnCourse,
                        });
                    }

                    setIsLoading(false);
                })
        } else {
            setCardData({});
            setIsLoading(false);
        }
    }

    const calculateData = () => {
        const predicted = cardData.model.predict(cardData.avgTime)[1];
        const actual = selectedAthlete.results.find((res) => res.season == season).meets[predIndex].time;

        const difference = actual - predicted;
        const percentDiff = (actual - predicted) / predicted;

        return {predicted, actual, difference, percentDiff};
    }

    useEffect(() => {
        generatePrediction(selectedAthlete.results.find((res) => res.season == season).meets[predIndex].meetId, season);
    }, [predIndex, selectedAthlete]);

    return (
        <Box m={2} mx="auto" p={4} backgroundColor="gray.100" rounded="md" boxShadow="md" maxWidth="75%" opacity={(isLoading ? "0.5" : "1")}>
            <Flex justifyContent="space-between">
                <Text fontSize="xl" noOfLines={1} maxW="50%">{selectedAthlete.results.find((res) => res.season == season).meets[predIndex].meetName}</Text>
                <Text fontSize="xl">{(new Date(selectedAthlete.results.find((res) => res.season == season).meets[predIndex].date).toDateString())}</Text>
            </Flex>
            {

                (isLoading) ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                    {(cardData.model && calculateData().actual) ? (
                        <Box>
                            <Text fontSize="3xl" my={2} textAlign="center" color={(calculateData().difference > 10 ? "red.400" : "green.400")}>{`${(calculateData().difference > 0) ? "+" : ""}${calculateData().difference.toFixed(1)}s`}</Text>
                            <Text>{selectedAthlete.name} ran {Math.abs(calculateData().difference).toFixed(1)} seconds {calculateData().difference > 0 ? "slower" : "faster"} ({secondsToReadable(calculateData().actual)}) than they were predicted to ({secondsToReadable(calculateData().predicted)})</Text>
                            <br />
                            <Text>{selectedAthlete.name}'s predicted SR is</Text>
                            <Text fontSize="3xl" my={2} textAlign="center">{secondsToReadable(cardData.srModel.predict(cardData.timeOnCourse)[1])}</Text>
                        </Box>
                    ) : (
                        <Text textAlign="center" color="red.400">No prediction data could be found</Text>
                    )}
                    </>)
            }
            
        </Box>
    );
}

export default PerformanceCard;