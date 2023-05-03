import React, { useContext, useEffect, useState } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer, Image, useToast, Spinner, Box, Divider, useDisclosure } from "@chakra-ui/react";
import { AuthContext } from "../contexts/Auth";
import { HiCheck, HiCheckCircle, HiClock, HiEmojiHappy, HiLightBulb, HiUsers, HiVideoCamera, HiX, HiXCircle } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import api from "../config/api";
import environment from "../config/environment";
import { formatDate } from "../utils/date";
import SelectPersonModal from "../components/SelectPersonModal";

const Call: React.FC = () => {
  const { id: userId, user } = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [call, setCall] = useState<Record<string, any> | null>(null);
  const [currentPerson, setCurrentPerson] = useState<Record<string, any> | null>(null);
  const [people, setPeople] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    fetchCall();
  }, []);

  const fetchCall = () => {
    api.get(`/calls/${id}`).then((res) => {
      setCall(res.data.call);
      setCurrentPerson(res.data.call.person);
      setLoading(false);
    }).catch((err) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
    });

    api.get("/people", { params: { user: userId } }).then((res) => {
      setPeople(res.data.people);
    }).catch((err) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as pessoas. Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleAnswer = (answer: boolean) => {
    setSending(true);
    api.put(`/calls/${id}`, { answer, person: currentPerson }).then((res) => {
      fetchCall();
    }).catch((err) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atender a chamada. Tente novamente mais tarde.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }).finally(() => {
      setSending(false);
    });
  };

  const handleModal = () => {
    onOpen();
  };

  const handleModalClose = (data: any) => {
    if (data === null) {
      onClose();
      return;
    }

    if (data["personId"]) {
      setCurrentPerson(people.find((person: any) => person.id === data["personId"]) || {});
      onClose();
      return;
    }

    setCurrentPerson({
      id: null,
      name: data["name"],
      image: call?.croppedImage,
      defaultAnswer: data["defaultAnswer"],
      userId: user?.id,
      createdAt: null,
      updatedAt: null,
    });
    onClose();
  };

  return (
    <Container maxW="container.xl" py={{ base: "6", md: "12" }} px={{ base: "4", sm: "8" }}>
      {isOpen && (
        <SelectPersonModal isOpen onClose={handleModalClose} people={people} />
      )}
      <Heading as="h1" fontSize={{ base: "2xl", md: "4xl" }}>Chamada</Heading>
      <Stack direction={{ base: "column", md: "row" }} mt={{ base: "4", md: "8" }} spacing={{ base: "4", md: "8" }}>
        {loading ? (
          <Flex w="full" p="4" justify="center">
            <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
          </Flex>
        ) : (
          <Box>
            <Image src={`${environment.API_URL}/${call?.image}`} borderRadius={{ base: "md", md: "lg" }} maxH="72" w="auto" />
          </Box>
        )}
        <Box flex="1">
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" display="flex" alignItems="center">
            <Icon as={HiClock} mr="2" color="teal.500" />
            {formatDate(call?.createdAt)}
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" display="flex" alignItems="center">
            <Icon as={HiEmojiHappy} mr="2" color="teal.500" />
            {currentPerson?.name || "Desconhecido"}
            {!call?.person && (
              <Button colorScheme="teal" ml="2" size="sm" variant="link" onClick={handleModal}>(Selecionar)</Button>
            )}
          </Text>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" display="flex" alignItems="center">
            <Icon as={HiLightBulb} mr="2" color="teal.500" />
            {(call?.confidence || 0).toFixed(2)}% de confiança
          </Text>
          {call?.answer === null ? (
            <Flex gap="2" mt="4">
              <Button onClick={() => handleAnswer(true)} isLoading={sending}>Aprovar</Button>
              <Button colorScheme="red"onClick={() => handleAnswer(false)} isLoading={sending}>Recusar</Button>
            </Flex>
          ) : (
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" display="flex" alignItems="center" mt="4">
              {call?.answer === true ? (
                <Flex bg="green.400" align="center" justify="center" color="white" borderRadius="md" px={{ base: "2", md: "4" }} py={{ base: "1", md: "2" }}>
                  <Icon as={HiCheck} />
                  <Text ml="2">Entrada aprovada</Text>
                </Flex>
              ) : (
                <Flex bg="red.400" align="center" justify="center" color="white" borderRadius="md" px={{ base: "2", md: "4" }} py={{ base: "1", md: "2" }}>
                  <Icon as={HiX} />
                  <Text ml="2">Entrada recusada</Text>
                </Flex>
              )}
            </Text>
          )}
        </Box>
      </Stack>
    </Container>
  );
}

export default Call;
