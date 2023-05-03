import React, { useContext, useEffect, useState } from "react";
import { Button, Flex, Heading, Text, Container, Stack, Icon, Spacer, useToast, Spinner } from "@chakra-ui/react";
import { HiCheck, HiCheckCircle, HiExclamation, HiUsers, HiVideoCamera, HiX, HiXCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import { AuthContext } from "../contexts/Auth";
import api from "../config/api";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
};

const translation: Record<string, string> = {
  "true": "Aprovadas",
  "false": "Recusadas",
  "null": "Pendentes"
};

const Stats: React.FC = () => {
  const { id } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, any>>({});
  const toast = useToast();
 
  const callsByPerson = {
    labels: stats.callsByPerson?.map((call: any) => call.person) || [],
    datasets: [
      {
        label: "Quantidade",
        data: stats.callsByPerson?.map((call: any) => call.count) || [],
        backgroundColor: "#319795",
      },
    ],
  };
 
  const callsByDay = {
    labels: stats.callsByDay?.map((call: any) => call.day) || [],
    datasets: [
      {
        label: "Quantidade",
        data: stats.callsByDay?.map((call: any) => call.count) || [],
        backgroundColor: "#319795",
      },
    ],
  };

  const callsByAnswer = {
    labels: stats.callsByAnswer?.map((call: any) => translation[call.answer?.toString() || "null"]) || [],
    datasets: [
      {
        data: stats.callsByAnswer?.map((call: any) => call.count) || [],
        backgroundColor: [
          "#ECC94B",
          "#E53E3E",
          "#38A169",
        ],
        borderColor: [
          "#FFF",
          "#FFF",
          "#FFF",
        ],
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    setLoading(true);

    api.get(`/stats`, { params: { user: id }}).then((res) => {
      setStats(res.data);
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
      <Heading as="h1" mb={{ base: "4", md: "8" }} fontSize={{ base: "2xl", md: "4xl" }}>Estatísticas</Heading>
      {loading ? (
        <Flex w="full" p="4" justify="center">
          <Spinner size={{ base: "sm", md: "md" }} color="teal.500" />
        </Flex>
      ) : (
        <>
          <Stack direction={{ base: "column", md: "row" }} spacing={{ base: "4", md: "8" }}>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" p="8" borderRadius="lg" boxShadow="md">
              <Icon as={HiVideoCamera} fontSize="4xl" color="teal.500" />
              <Text mt="4" fontSize="xl" fontWeight="bold" color="gray.700">{stats?.callsCount || "?"}</Text>
              <Text mt="2" fontSize="md" color="gray.500">Chamadas</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" p="8" borderRadius="lg" boxShadow="md">
              <Icon as={HiUsers} fontSize="4xl" color="teal.500" />
              <Text mt="4" fontSize="xl" fontWeight="bold" color="gray.700">{stats?.peopleCount || "?"}</Text>
              <Text mt="2" fontSize="md" color="gray.500">Pessoas</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" p="8" borderRadius="lg" boxShadow="md">
              <Icon as={HiExclamation} fontSize="4xl" color="yellow.400" />
              <Text mt="4" fontSize="xl" fontWeight="bold" color="gray.700">{stats?.pendingCount || "?"}</Text>
              <Text mt="2" fontSize="md" color="gray.500">Chamadas pendentes</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" p="8" borderRadius="lg" boxShadow="md">
              <Icon as={HiCheckCircle} fontSize="4xl" color="green.500" />
              <Text mt="4" fontSize="xl" fontWeight="bold" color="gray.700">{stats?.approvedCount || "?"}</Text>
              <Text mt="2" fontSize="md" color="gray.500">Chamadas aprovadas</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" p="8" borderRadius="lg" boxShadow="md">
              <Icon as={HiXCircle} fontSize="4xl" color="red.500" />
              <Text mt="4" fontSize="xl" fontWeight="bold" color="gray.700">{stats?.rejectedCount || "?"}</Text>
              <Text mt="2" fontSize="md" color="gray.500">Chamadas recusadas</Text>
            </Flex>
          </Stack>
          <Stack pb="4" direction={{ base: "column", md: "row" }} spacing={{ base: "4", md: "8" }} mt={{ base: 4, md: 8 }}>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" px="8" py="12" borderRadius="lg" boxShadow="md" h="80" overflow="hidden">
              <Bar options={options} data={callsByDay} />
              <Text mt="4" fontSize="md" color="gray.500">Chamadas x Data</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" px="8" py="12" borderRadius="lg" boxShadow="md" h="80" overflow="hidden">
              <Pie options={options} data={callsByAnswer} />
              <Text mt="4" fontSize="md" color="gray.500">Respostas das chamadas</Text>
            </Flex>
            <Flex direction="column" align="center" justify="center" w="full" bg="white" px="8" py="12" borderRadius="lg" boxShadow="md" h="80" overflow="hidden">
              <Bar options={options} data={callsByPerson} />
              <Text mt="4" fontSize="md" color="gray.500">Chamadas x Pessoa</Text>
            </Flex>
          </Stack>
        </>
      )}
    </Container>
  );
}
 
export default Stats;
