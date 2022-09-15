import { Box, Checkbox, Flex, FormControl, FormHelperText, FormLabel, Input, Text, Button, Heading, Select, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { useState } from "react";
import config from "../config";

function Scrape(props) {

    const [isLoading, setIsLoading] = useState(false);

    const [meetUrl, setMeetUrl] = useState("");
    const [includeAllRaces, setIncludeAllRaces] = useState(false);
    const [jsonToken, setJsonToken] = useState("");

    const [scrapeType, setScrapeType] = useState("school");

    const [schoolUrl, setSchoolUrl] = useState("");
    const [season, setSeason] = useState(2021);

    const onClickScrape = async() => {
        setIsLoading(true);
        if(meetUrl.match(/https:\/\/www\.athletic\.net\/CrossCountry\/meet\/[0-9]+\/results\/[0-9]+/) ||
            meetUrl.match(/https:\/\/www\.athletic\.net\/CrossCountry\/meet\/[0-9]+\/results/)) {
            // Scrape from race
            try {

                let response;
                
                if(includeAllRaces) {
                    response = await fetch(config.apiUrl + '/scrapeMeetAthletes', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            meetId: meetUrl.match(/[0-9]+/g)[0],
                            jsonToken: jsonToken
                        })
                    });

                } else {
                    response = await fetch(config.apiUrl + '/scrapeRaceAthletes', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            raceId: meetUrl.match(/[0-9]+/g)[1],
                            jsonToken: jsonToken
                        })
                    });
                }

                response.json().then((data) => alert(`${data.athletesAdded} athletes added! (${data.totalAthletes - data.athletesAdded} of ${data.totalAthletes} in database already)`));

            } catch (err) {
                console.log("Error fecthing new data on", meetUrl, err);
            }
        }
        setIsLoading(false);
    }

    const onClickScrapeSchool = () => {
        setIsLoading(true);

        if(schoolUrl.match(/https:\/\/www\.athletic\.net\/team\/[0-9]+\/cross-country\/[0-9]+/)) {
            const schoolId = schoolUrl.match(/[0-9]+/g)[0];
            fetch(config.apiUrl + '/scrapeSchoolAthletes', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    schoolId: schoolId,
                    season: season
                })
            }).then((res) => res.json()).then((data) => {
                alert(`${data.athletesAdded} athletes added! (${data.totalAthletes - data.athletesAdded} of ${data.totalAthletes} in database already)`);
                setIsLoading(false);
            }).catch(err => {console.log("error fetching new school data", err); setIsLoading(false)});
        }
    }

    return (
        <Box p={12}>
            <Heading fontSize="2xl">Scrape new data</Heading>
            <FormControl>
                <FormLabel>Choose a scraping type</FormLabel>
                <RadioGroup value={scrapeType} onChange={setScrapeType}>
                    <Stack direction="row">
                        <Radio value="race">Scrape from race</Radio>
                        <Radio value="school">Scrape from school</Radio>
                    </Stack>
                </RadioGroup>
            </FormControl>
            {
                (scrapeType == "race") ? (
                    <Box m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                        <FormControl mb={2}>
                            <FormLabel>Paste link from race to add to database</FormLabel>
                            <Flex alignItems="end">
                                <Input flex={3} type="text" placeholder="https://www.athletic.net/CrossCountry/meet/179877/results/775015" value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} />
                                <Checkbox flex={1} ml={2} value={includeAllRaces} onChange={(e) => setIncludeAllRaces(!includeAllRaces)}>Include all races at meet?</Checkbox>
                            </Flex>
                            <FormHelperText>Link to the results page for a single race or entire meet</FormHelperText>
                        </FormControl>
                        <FormControl maxWidth="75%" mb={2}>
                            <FormLabel>Paste anettokens</FormLabel>
                            <Input type="text" placeholder="anettokens" value={jsonToken} onChange={(e) => setJsonToken(e.target.value)} />
                            <FormHelperText>This is necessary to access data from athletic.net</FormHelperText>
                        </FormControl>
                        <Button onClick={onClickScrape} isDisabled={isLoading}>Scrape Data</Button>
                    </Box>
                ) : (
                    <Box m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                        <FormControl mb={2}>
                            <FormLabel>Paste link to school to add to database</FormLabel>
                            <Flex alignItems="end">
                                <Input flex={3} type="text" placeholder="https://www.athletic.net/team/408/cross-country/2021" value={schoolUrl} onChange={(e) => setSchoolUrl(e.target.value)} />
                            </Flex>
                            <FormHelperText>You will update (or add) data for each athlete at this school for the specified season</FormHelperText>
                        </FormControl>
                        <FormControl mb={2}>
                        <FormLabel>Choose a season</FormLabel>
                        <Select placeholder='Select a season' value={season} onChange={(e) => setSeason(e.target.value)} maxWidth="25%">
                            {
                                [2022, 2021, 2020, 2019, 2018].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button onClick={onClickScrapeSchool} isDisabled={isLoading}>Scrape Data</Button>
                    </Box>
                )
            }
        </Box>
    )
}

export default Scrape;