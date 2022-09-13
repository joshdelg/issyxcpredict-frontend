import { Box, Checkbox, Flex, FormControl, FormHelperText, FormLabel, Input, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import config from "../config";

function Scrape(props) {

    const [isLoading, setIsLoading] = useState(false);

    const [meetUrl, setMeetUrl] = useState("");
    const [includeAllRaces, setIncludeAllRaces] = useState(false);
    const [jsonToken, setJsonToken] = useState("");

    const onClickScrape = async(mode) => {
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

    return (
        <Box p={12}>
            <Text fontSize="2xl">Scrape new data</Text>
            <Box m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                <FormControl mb={2}>
                    <FormLabel>Paste link from race to add to database</FormLabel>
                    <Flex alignItems="end">
                        <Input flex={3} type="text" placeholder="abvcd" value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} />
                        <Checkbox flex={1} ml={2} value={includeAllRaces} onChange={(e) => setIncludeAllRaces(!includeAllRaces)}>Include all races at meet?</Checkbox>
                    </Flex>
                    <FormHelperText>Link to the results page for a single race, even if scraping from entire meet</FormHelperText>
                </FormControl>
                <FormControl maxWidth="75%" mb={2}>
                    <FormLabel>Paste anettokens</FormLabel>
                    <Input type="text" placeholder="anettokens" value={jsonToken} onChange={(e) => setJsonToken(e.target.value)} />
                    <FormHelperText>This is necessary to access data from athletic.net</FormHelperText>
                </FormControl>
                <Button onClick={onClickScrape} isDisabled={isLoading}>Scrape Data</Button>
            </Box>
        </Box>
    )
}

export default Scrape;