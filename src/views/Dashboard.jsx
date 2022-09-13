import { Heading, Text, Box, Grid, GridItem, UnorderedList, ListItem, List, Stack, Flex, Switch } from "@chakra-ui/react";
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
    const [selectedAthlete, setSelectedAthlete] = useState({athleteId: "team"});

    const getSchoolAthletes = () => {
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
        });
    }

    useEffect(() => {
        getSchoolAthletes();
    }, []);

    return (
        <Box>
            <Grid gridTemplateColumns="1fr 5fr" gridTemplateRows="repeat(1, 1fr)">
                <GridItem>
                    <Box borderRight="1px" borderColor="gray.200" textAlign="center">
                        <Box onClick={() => setSelectedAthlete({athleteId: "team"})} background={(selectedAthlete.athleteId == "team") ? "gray.200" : ""} _hover={{background: "gray.100"}} p={2}>Team View</Box>
                        {schoolAthletes && (
                            schoolAthletes.filter((a) => a.gender === gender && a.pr5k !== 0).sort((a, b) => a.pr5k - b.pr5k).map((a) => (
                                <Box key={a.athleteId} onClick={() => setSelectedAthlete(a)} background={(selectedAthlete.athleteId == a.athleteId) ? "gray.200" : ""} _hover={{background: "gray.100"}} transition="background 0.25s" p={2}>{a.name}</Box>
                            ))
                        )}
                    </Box>
                </GridItem>
                <GridItem p={2}>
                    <Flex justifyContent="space-between">
                        <Heading>Coach's Dashboard</Heading>
                        <Flex m={4} alignItems="center">
                            <Text>Men's</Text>
                            <Switch mx={2} isChecked={gender !== "M"} onChange={(e) => {setGender((gender === "M") ? "F" : "M"); setSelectedAthlete({athleteId: "team"})}}/>
                            <Text>Women's</Text>
                        </Flex>
                    </Flex>
                    {
                        selectedAthlete.athleteId !== "team" ? (
                            <>
                                <AthleteProgression selectedAthlete={selectedAthlete} season={season}/>
                                <AthletePerformance selectedAthlete={selectedAthlete} season={season}/>
                            </>
                        ) : (
                        <>
                            <Box>
                                <Text>Your Team Rank: 2</Text>
                            </Box>
                            <Box>Ranking Progression</Box>
                            <Box>Team Progression</Box>
                            <Box>Meets</Box>
                        </>
                        )
                    }
                </GridItem>
            </Grid>
        </Box>
    );
}

export default Dashboard;