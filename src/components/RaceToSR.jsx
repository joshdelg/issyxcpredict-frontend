import { useEffect, useState } from "react";
import { Text, Grid, GridItem, Box, FormControl, FormLabel, Input, Select, Button, Stack, Checkbox, Flex, FormHelperText } from "@chakra-ui/react";
import { secondsToReadable } from "../lib/timeLibs";
import { getMeetData, getPredictionData, getPredictionMeetData } from "../lib/meetLibs";
import { buildModel } from "../lib/regressionLibs";
import AthleteCard from "./AthleteCard";
import config from "../config";
import CourseCard from "./CourseCard";
import PredictionCard from "./PredictionCard";

function RaceToSR(props) {  

    const { isLoading, setIsLoading } = props;

    const [restrictToRace, setRestrictToRace] = useState(false);

    const [meetUrl, setMeetUrl] = useState("");
    const [prevMeetUrl, setPrevMeetUrl] = useState("");

    const [meetAthletes, setMeetAthletes] = useState([]);
    const [meetSeason, setMeetSeason] = useState();
    const [meetIds, setMeetIds] = useState();
    const [meetData, setMeetData] = useState();

    // TODO Refactor to support multiple previous meets
    const [prevMeetAthletes, setPrevMeetAthletes] = useState([]);
    const [prevMeetSeason, setPrevMeetSeason] = useState();
    const [prevMeetIds, setPrevMeetIds] = useState();
    const [prevMeetData, setPrevMeetData] = useState();

    const [selectedAthlete, setSelectedAthlete] = useState({});

    const [predictionModel, setPredictionModel] = useState();

    const onChangeSelectedAthlete = (e) => {
        setSelectedAthlete(meetAthletes.find((a) => a.athleteId === e.target.value))
    }

    // TODO Refactor to avoid duplication between these two methods and the one in AvgToRace
    useEffect(() => {
        getMeetAthletes();
    }, [meetUrl]);

    useEffect(() => {
        getPrevMeetAthletes();
    }, [prevMeetUrl])
    
    // Limit to just race athletes instead? TODO Yes I think?
    const getMeetAthletes = async() => {
        if(meetUrl.match(/https:\/\/www\.athletic\.net\/CrossCountry\/meet\/[0-9]+\/results\/[0-9]+/)) {
            setIsLoading(true);

            const [meetId, raceId] = meetUrl.match(/[0-9]+/g);
            setMeetIds({meetId: meetId, raceId: raceId});

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
                data[0].results.every((s) => {
                    if (s.meets.find((m) => m.meetId == meetId)) {
                        season = s.season;
                        return false;
                    }
                    return true;
                });
                setMeetSeason(season);
                setMeetAthletes(data);
                setMeetData(getMeetData(data, meetId, season));
                setIsLoading(false);
            })
        }
    }

    const getPrevMeetAthletes = async() => {
        if(prevMeetUrl.match(/https:\/\/www\.athletic\.net\/CrossCountry\/meet\/[0-9]+\/results\/[0-9]+/)) {
            setIsLoading(true);

            const [prevMeetId, prevRaceId] = prevMeetUrl.match(/[0-9]+/g);
            setPrevMeetIds({prevMeetId: prevMeetId, prevRaceId: prevRaceId});

            fetch(config.apiUrl + '/getMeetAthletes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    meetId: prevMeetId
                })
            }).then((res) => res.json()).then((data) => {
                let prevMeetSeason;
                data[0].results.every((s) => {
                    if (s.meets.find((m) => m.meetId == prevMeetId)) {
                        prevMeetSeason = s.season;
                        return false;
                    }
                    return true;
                });
                setPrevMeetSeason(prevMeetSeason);
                setPrevMeetAthletes(data);
                setPrevMeetData(getMeetData(data, prevMeetId, prevMeetSeason));
                setIsLoading(false);
            })
        }
    }

    const onClickPredict = () => {
        const predictionData = getPredictionMeetData(prevMeetAthletes, prevMeetSeason, prevMeetIds, selectedAthlete.gender, restrictToRace);
        const model = buildModel(predictionData);
        setPredictionModel(model);
    }

    const getPrediction = () => {
        const timeOnCourse = selectedAthlete.results.find((s) => s.season === meetSeason).meets.find((res) => res.meetId === meetIds.meetId).time;
        // console.log(timeOnCourse);
        const prediction = predictionModel.predict(timeOnCourse);
        return prediction[1];
    }

    return (
        <>
        <Stack>
            <Checkbox value={restrictToRace} onChange={() => setRestrictToRace(!restrictToRace)}>Restrict to race?</Checkbox>
        </Stack>
        <Grid templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)">
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                <Text fontSize="xl" mb={2}>Athlete Information</Text>
                <Box>
                    <FormControl mb={2}>
                        <FormLabel>Paste link from this year's race</FormLabel>
                        <Input type='text' placeholder="https://www.athletic.net/CrossCountry/meet/208604/results/850206" value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} />
                        <FormHelperText>Paste link to results page for a single race</FormHelperText>
                    </FormControl>
                    <FormControl mb={2}>
                        <FormLabel>Choose athlete from that race</FormLabel>
                        <Select placeholder='Select an athlete' value={selectedAthlete.athleteId} onChange={(e) => onChangeSelectedAthlete(e)} isDisabled={!(meetAthletes.length > 0) || isLoading}>
                            {
                                meetAthletes.length > 0 && (meetAthletes.map((athlete, index) => (
                                    <option key={index} value={athlete.athleteId}>{athlete.name}</option>
                                )))
                            }
                        </Select>
                    </FormControl>
                </Box>
            </GridItem>
            <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                <Text fontSize="xl" mb={2}>Course Information</Text>
                <Box>
                    <FormControl mb={2}>
                        <FormLabel>Paste link from last year's meet</FormLabel>
                        <Input type='text' placeholder="https://www.athletic.net/CrossCountry/meet/193234/results/791845" value={prevMeetUrl} onChange={(e) => setPrevMeetUrl(e.target.value)} />
                        <FormHelperText>Paste link to results page for a single race, data will be used from the whole meet unless "Restrict to Race" is checked</FormHelperText>
                    </FormControl>
                </Box>
            </GridItem>
            {
                selectedAthlete.results && (
                    <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                        <AthleteCard selectedAthlete={selectedAthlete} season={meetSeason} meetData={meetData} mode="race2sr"/>
                    </GridItem>
                )
            }
            {
                prevMeetAthletes.length > 0 && (
                    <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                        <CourseCard meetAthletes={prevMeetAthletes} meetData={prevMeetData} />
                    </GridItem>
                )
            }
            {
                (selectedAthlete.results && meetAthletes.length > 0) && (
                    <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200" gridColumn="1 / span 2">
                        {
                            predictionModel && (
                                <PredictionCard selectedAthlete={selectedAthlete} meetData={meetData} predictionModel={predictionModel} getPrediction={getPrediction} predictionType="race2sr" />
                            )
                        }
                        <Flex mt={4} justifyContent="center" alignItems="center">
                            <Button onClick={onClickPredict} isLoading={isLoading} isDisabled={!(selectedAthlete.athleteId && meetAthletes[0])}>Make Predictions!</Button>
                        </Flex>
                    </GridItem>
                )
            }
        </Grid>
        </>
    )
}

export default RaceToSR;