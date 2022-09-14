import { useState, useEffect } from "react";
import { Container, FormControl, FormLabel, Text, Box, Input, Grid, GridItem, Select, Stack, RadioGroup, Radio, Button, Flex } from "@chakra-ui/react";
import { secondsToReadable } from "../lib/timeLibs";
import { getAthleteAverageTime, getAthleteSR } from "../lib/athleteLibs";
import { getPredictionData, getMeetData } from "../lib/meetLibs";
import { buildModel } from "../lib/regressionLibs";
import AthleteCard from "./AthleteCard";
import CourseCard from "./CourseCard";
import PredictionCard from "./PredictionCard";
import config from "../config";

function AvgToRace(props) {

    // Lifecycle state
    const { isLoading, setIsLoading } = props;

    // School/athlete data
    const [schoolUrl, setSchoolUrl] = useState("");
    const [season, setSeason] = useState(2021);
    const [schoolAthletes, setSchoolAthletes] = useState([]);
    const [selectedAthlete, setSelectedAthlete] = useState({});

    // Meet data
    const [meetUrl, setMeetUrl] = useState("");
    const [meetIds, setMeetIds] = useState();
    const [meetDate, setMeetDate] = useState();
    const [meetAthletes, setMeetAthletes] = useState([]);
    const [meetSeason, setMeetSeason] = useState();
    const [meetData, setMeetData] = useState();

    // Prediction data
    const [predictionMethod, setPredictionMethod] = useState("avg");
    const [predictionModel, setPredictionModel] = useState();

    useEffect(() => {
        getSchoolAthletes();
    }, [schoolUrl, season]);

    useEffect(() => {
        getMeetAthletes();
    }, [meetUrl]);

    const getSchoolAthletes = () => {
        // Check if url matches athletic.net form
        if (schoolUrl.match(/https:\/\/www\.athletic\.net\/team\/[0-9]+\/cross-country\/[0-9]+/)) {
            setIsLoading(true);
            // Rip schoolId and request query dabase 
            const schoolId = schoolUrl.match(/[0-9]+/g)[0];
            fetch(config.apiUrl + '/getSchoolAthletes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    schoolId: schoolId,
                    season: season
                })
            }).then((res) => res.json()).then((data) => {
                setSchoolAthletes(data);
                setIsLoading(false);
            });
        }
    }

    const getMeetAthletes = () => {
        // Check if meet url is valid
        if (meetUrl.match(/https:\/\/www\.athletic\.net\/CrossCountry\/meet\/[0-9]+\/results\/[0-9]+/)) {
            setIsLoading(true);
            const [meetId, raceId] = meetUrl.match(/[0-9]+/g);
            setMeetIds({ meetId: meetId, raceId: raceId });
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
                        meetDate = race.date;
                        console.log(race.date);
                        return false;
                    }
                    return true;
                });
                setMeetSeason(season);
                setMeetDate(meetDate);
                setMeetAthletes(data);
                setMeetData(getMeetData(data, meetId, season));
                setIsLoading(false);
            })
        }
    }

    const onChangeSelectedAthlete = (e) => {
        setSelectedAthlete(schoolAthletes.find((a) => a.athleteId === e.target.value));
    }

    const onClickPredict = () => {
        const predictionData = getPredictionData(meetAthletes, meetSeason, meetIds.meetId, (new Date(meetDate)).valueOf(), predictionMethod);
        const model = buildModel(predictionData);
        setPredictionModel(model);
    }

    const getPrediction = () => {
        let newDate = new Date(meetDate);
        newDate.setFullYear(season);
        console.log(newDate.valueOf());
        const avgTime = getAthleteAverageTime(selectedAthlete, season, meetData.distance, newDate.valueOf());
        console.log(secondsToReadable(avgTime));
        const prediction = predictionModel.predict(avgTime);
        return prediction[1];
    }

    return (
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)">
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                <Text fontSize="xl" mb={2}>Athlete Information</Text>
                <Box>
                    <FormControl mb={2}>
                        <FormLabel>Paste school link</FormLabel>
                        <Input type='text' placeholder="https://www.athletic.net/team/408/cross-country/2021" value={schoolUrl} onChange={(e) => setSchoolUrl(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Choose a season</FormLabel>
                        <Select placeholder='Select a season' value={season} onChange={(e) => setSeason(e.target.value)}>
                            {
                                [2021, 2020, 2019, 2018].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                    {
                        schoolAthletes.length > 0 && (
                            <FormControl mb={2}>
                                <FormLabel>Select athlete to predict</FormLabel>
                                <Select placeholder='Select an athlete' value={selectedAthlete.athleteId} onChange={(e) => onChangeSelectedAthlete(e)}>
                                    {
                                        schoolAthletes.map((athlete, index) => (
                                            <option key={index} value={athlete.athleteId}>{athlete.name}</option>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        )
                    }
                </Box>
            </GridItem>
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                <Text fontSize="xl" mb={2}>Course Information</Text>
                <Box>
                    <FormControl mb={2}>
                        <FormLabel>Paste link from last year's meet</FormLabel>
                        <Input type='text' placeholder='https://www.athletic.net/CrossCountry/meet/156439/results/652131' value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} />
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Choose a prediction method</FormLabel>
                        <RadioGroup value={predictionMethod} onChange={setPredictionMethod}>
                            <Stack direction="row">
                                <Radio value="avg">Average time before race</Radio>
                                <Radio value="sr">SR before race (less accurate)</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Box>
            </GridItem>
            {selectedAthlete.results && (
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                    <AthleteCard selectedAthlete={selectedAthlete} season={season} meetData={meetData} mode="avg2race"/>
            </GridItem>
            )}
            {(meetAthletes.length > 0 && meetData) && (
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                    <CourseCard meetAthletes={meetAthletes} meetData={meetData} />
            </GridItem>
            )}
            {
                (selectedAthlete.results && meetAthletes.length > 0) && (
                    <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200" gridColumn="1 / span 2">
                        {
                            predictionModel && (
                                <PredictionCard selectedAthlete={selectedAthlete} meetData={meetData} predictionModel={predictionModel} getPrediction={getPrediction} predictionType="avg2race" />             
                            )
                        }
                        <Flex mt={4} justifyContent="center" alignItems="center">
                            <Button onClick={onClickPredict} isLoading={isLoading} isDisabled={!(selectedAthlete.athleteId && meetAthletes[0])}>Make Predictions!</Button>
                        </Flex>
                    </GridItem>
                )
            }
        </Grid>
    );
}

export default AvgToRace;