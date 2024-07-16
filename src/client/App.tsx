import "./App.css";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import WebSocket from "./components/WebSocket";

export default function App() {
  return (
    <ChakraProvider>
      <Heading
        size="xl"
        mb={2}
        textAlign="center"
        color="black.600"
        textTransform="uppercase"
        letterSpacing="wide"
        fontWeight="bold"
        pb={2}
      >
        System Metrics
      </Heading>
      <WebSocket />
    </ChakraProvider>
  );
}
