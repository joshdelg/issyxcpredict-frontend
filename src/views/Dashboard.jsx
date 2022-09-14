import { Heading, Text, Box, Grid, GridItem, UnorderedList, ListItem, List, Stack, Flex, Switch, Select } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import AthletePerformance from "../components/AthletePerformance";
import AthleteProgression from "../components/AthleteProgression";
import config from "../config";

function Dashboard() {

    const [schoolId, setSchoolId] = useState("408");
    const [gender, setGender] = useState("M");
    const [schoolAthletes, setSchoolAthletes] = useState();
    const [season, setSeason] = useState(2021);
    const [selectedAthlete, setSelectedAthlete] = useState({});

    const [predIndex, setPredIndex] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const getSchoolAthletes = () => {
        setIsLoading(true);
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

    useEffect(() => {
        getSchoolAthletes();
    }, [season]);

    return (
        <Box>
            <Grid gridTemplateColumns="1fr 5fr" gridTemplateRows="repeat(1, 1fr)">
                <GridItem>
                    <Box borderRight="1px" borderColor="gray.200" textAlign="center">
                        <>
                        {/* <Box onClick={() => setSelectedAthlete({athleteId: "team"})} background={(selectedAthlete.athleteId == "team") ? "gray.200" : ""} _hover={{background: "gray.100"}} p={2}>Team View</Box> */}
                        {schoolAthletes && (
                            schoolAthletes.filter((a) => a.gender === gender && a.pr5k !== 0).sort((a, b) => a.pr5k - b.pr5k).map((a) => (
                                <Box opacity={(isLoading) ? "50%" : "100%"} key={a.athleteId} onClick={() => {setSelectedAthlete(a); setPredIndex(0)}} background={(selectedAthlete.athleteId == a.athleteId) ? "gray.200" : ""} _hover={{background: "gray.100"}} transition="background 0.25s" p={2}>{a.name}</Box>
                            ))
                        )}
                        </>
                    </Box>
                </GridItem>
                <GridItem p={2}>
                    <Flex justifyContent="space-between">
                        <Heading>Coach's Dashboard</Heading>
                        <Flex m={4} alignItems="center">
                            <Text>Men's</Text>
                            <Switch mx={2} isChecked={gender !== "M"} onChange={(e) => {setGender((gender === "M") ? "F" : "M"); setSelectedAthlete({})}}/>
                            <Text>Women's</Text>
                            <Text ml={4} mr={2}>Season</Text>
                            <Select placeholder="Select a season" value={season} onChange={(e) => {setSeason(e.target.value); setSelectedAthlete({});}}>
                                <option value={2021}>2021</option>
                                <option value={2022}>2022</option>
                            </Select>
                        </Flex>
                    </Flex>
                    {
                        selectedAthlete.athleteId && (
                            <>
                                <AthleteProgression selectedAthlete={selectedAthlete} season={season} predIndex={predIndex} setPredIndex={setPredIndex} />
                                <AthletePerformance selectedAthlete={selectedAthlete} season={season} predIndex={predIndex} setPredIndex={setPredIndex}/>
                            </>
                        )
                    } 
                </GridItem>
            </Grid>
        </Box>
    );
}

export default Dashboard;