import { Link, Outlet } from "react-router-dom";
import { Box, Container, Flex, Text } from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
      <Flex justifyContent="space-between" bg="tan">
        <Text fontSize="3xl">XCPredict</Text>
        <Flex>
          <Text fontSize="xl">
            <Link to="/home">Home</Link>
          </Text>
          <Text fontSize="xl">
            <Link to="/predict">Predict</Link>
          </Text>
          <Text fontSize="xl">
            <Link to="/dashboard">Dashboard</Link>
          </Text>
          <Text fontSize="xl">
            <Link to="/scrape">Scrape</Link>
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default App;
