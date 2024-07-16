import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Box,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Card,
  CardFooter,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { IRegionSystemMetrics } from "../types/region-system-metrics";

export default function RegionSystemMetricCard({
  regionData,
}: {
  regionData: IRegionSystemMetrics;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: "scale(1.05)", boxShadow: "xl", cursor: "pointer" }}
      onClick={onOpen}
    >
      <CardHeader p={4} bg="blue.500" color="white">
        <Heading size="md">{regionData.region}</Heading>
      </CardHeader>
      <CardFooter className="flex justify-center" p={4} bg="gray.100">
        <Box display={"flex"} justifyContent={"center"} width={"100%"}>
          <Button colorScheme="blue" onClick={onOpen}>
            View Metrics
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent maxW={"80%"}>
              <ModalHeader>Server Status</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box
                  mb={4}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    General
                  </Text>
                  <Text>
                    Status:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.status}
                    </Text>
                  </Text>
                  <Text>
                    Region:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.region}
                    </Text>
                  </Text>
                  <Text>
                    Roles:{" "}
                    <Text as="span" fontWeight="medium">
                      {"abc" ?? regionData.roles.join(", ")}
                    </Text>
                  </Text>
                </Box>

                <Box
                  mb={4}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Services
                  </Text>
                  <List spacing={2}>
                    <ListItem>
                      Redis:{" "}
                      <Text
                        as="span"
                        color={
                          regionData.results.services.redis
                            ? "green.500"
                            : "red.500"
                        }
                      >
                        {regionData.results.services.redis
                          ? "Online"
                          : "Offline"}
                      </Text>
                    </ListItem>
                    <ListItem>
                      Database:{" "}
                      <Text
                        as="span"
                        color={
                          regionData.results.services.database
                            ? "green.500"
                            : "red.500"
                        }
                      >
                        {regionData.results.services.database
                          ? "Online"
                          : "Offline"}
                      </Text>
                    </ListItem>
                  </List>
                </Box>

                <Box
                  mb={4}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Stats
                  </Text>
                  <Text>
                    Servers Count:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.servers_count}
                    </Text>
                  </Text>
                  <Text>
                    Online Users:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.online}
                    </Text>
                  </Text>
                  <Text>
                    Session:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.session}
                    </Text>
                  </Text>
                </Box>

                <Box
                  mb={4}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  bg="gray.50"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    Server Details
                  </Text>
                  <Text>
                    Active Connections:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.server.active_connections}
                    </Text>
                  </Text>
                  <Text>
                    Wait Time:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.server.wait_time}
                    </Text>
                  </Text>
                  <Text>
                    CPU Load:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.server.cpu_load}
                    </Text>
                  </Text>
                  <Text>
                    Timers:{" "}
                    <Text as="span" fontWeight="medium">
                      {regionData.results.stats.server.timers}
                    </Text>
                  </Text>

                  <Box mt={4}>
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                      Workers
                    </Text>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th px={0}>Type</Th>
                          <Th>Wait Time</Th>
                          <Th>Workers</Th>
                          <Th>Waiting</Th>
                          <Th>Idle</Th>
                          <Th>Time to Return</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {regionData.results.stats.server.workers.map(
                          ([type, details]: any, index: number) => (
                            <Tr key={index}>
                              <Td px={0}>{type}</Td>
                              <Td>{details.wait_time}</Td>
                              <Td>{details.workers}</Td>
                              <Td>{details.waiting}</Td>
                              <Td>{details.idle}</Td>
                              <Td>{details.time_to_return}</Td>
                            </Tr>
                          )
                        )}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </CardFooter>
    </Card>
  );
}
