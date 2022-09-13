import { Container, Heading, Text, Box, Grid, Flex, UnorderedList, ListItem, GridItem } from "@chakra-ui/react";

function Home() {
    return (
        <Container maxWidth="75%" py={4}>
            <Box my={12}>
                <Heading textAlign="center" fontSize="6xl" my={4}>Welcome to IssyXCPredict!</Heading>
                <Text textAlign="center" fontSize="2xl">An athletic.net based tool for number-crunching coaches and curious athletes</Text>
            </Box>
            <Grid width="100%" gridTemplateRows="1fr" gridTemplateColumns="repeat(3, 1fr)" gridGap={4}>
                <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                    <Heading fontSize="2xl" my={2}>Predict</Heading>
                    <UnorderedList>
                        <ListItem>Use times from a meet last year to predict what your athlete will run this year</ListItem>
                        <ListItem>Use times from a meet last year and your athlete's performance on the meet this year to predict their Season Record</ListItem>
                    </UnorderedList>
                </GridItem>
                <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                    <Heading fontSize="2xl" my={2}>Dashboard</Heading>
                    <UnorderedList>
                        <ListItem>See a realtime graph of each athlete's time over the season</ListItem>
                        <ListItem>See how your athlete stacked up against their predicted time and SR based on every meet</ListItem>
                    </UnorderedList>
                </GridItem>
                <GridItem m={2} p={4} border="1px" borderRadius="md" borderColor="gray.200">
                    <Heading fontSize="2xl" my={2}>Scrape</Heading>
                    <UnorderedList>
                        <ListItem>Add new data from a recent meet to the database (advanced users only!)</ListItem>
                    </UnorderedList>
                </GridItem>
            </Grid>
        </Container>
    );
}

export default Home;