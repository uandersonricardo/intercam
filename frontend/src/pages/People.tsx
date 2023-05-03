import React, { useContext, useState, useEffect } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer, useToast, Spinner, Avatar, Tooltip } from "@chakra-ui/react";
import { AuthContext } from "../contexts/Auth";
import { HiUsers, HiVideoCamera } from "react-icons/hi";
import { Link } from "react-router-dom";
import api from "../config/api";
import environment from "../config/environment";
 
const People: React.FC = () => {
  const { id, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);

    api.get(`/people`, { params: { user: id }}).then((res) => {
      setPeople(res.data.people);
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
  }, []);

  return (
    <Container maxW="container.xl" py={{ base: "6", md: "12" }} px={{ base: "4", sm: "8" }}>
      <Heading as="h1" mb={{ base: "4", md: "8" }} fontSize={{ base: "2xl", md: "4xl" }}>Pessoas</Heading>
      {loading ? (
        <Flex w="full" p="4" justify="center">
          <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
        </Flex>
      ) : (
        <>
          {people.length > 0 ? (
            <Flex columnGap="4" rowGap="4" pb="4" flexWrap="wrap">
              {people.map((person: any) => (
                <Tooltip key={person.id} label={person.name} aria-label="Tooltip">
                  <Avatar name={person.name} src={`${environment.API_URL}/${person.image}`} size={{ base: "lg", md: "xl" }} />
                </Tooltip>
              ))}
            </Flex>
          ) : (
            <Text w="full" align="center" color="gray.500" py={{ base: "6", md: "10" }}>
              Nenhuma pessoa cadastrada
            </Text>
          )}
        </>
      )}
    </Container>
  );
}
 
export default People;
