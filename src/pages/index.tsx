import {
  Button,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

export default function Home() {
  const [searchName, setSearchName] = useState('')
  return (
    <Stack
      w='100%'
      h='100%'
      justify='center'
      align='center'
      p={6}
    >
      <Stack
        w='100%'
        maxW='6xl'
        align='center'
        spacing={10}
      >
        <Heading
          bgColor='red'
          color='white'
          px={4}
          py={2}
        >
          Funcionários cadastrados
        </Heading>
        <HStack
          w='100%'
          justify='end'
        >
          <Button
            colorScheme="yellow"
          >
            Tickets
          </Button>
          <Button
            colorScheme="green"
            as={Link}
            href='/employee/create'
          >
            Novo
          </Button>
        </HStack>
        <Stack w='100%' px={6} direction='row' spacing={4}>
          <InputGroup size="sm" maxW='sm'>
            <InputLeftElement pointerEvents="none">
              <Icon as={RiSearch2Line} color="gray" boxSize="5" />
            </InputLeftElement>
            <Input
              placeholder="Pesquisar por nome"
              onChange={(e) => setSearchName(e.target.value)}
            />
          </InputGroup>
        </Stack>
        <Table variant='simple' colorScheme="red" size='lg'>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>CPF</Th>
              <Th>Ativo</Th>
              <Th>Criado</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Guilherme Spanserki</Td>
              <Td>10408429925</Td>
              <Td>A</Td>
              <Td>Há 2 anos</Td>
            </Tr>
            <Tr>
              <Td>Guilherme Spanserki</Td>
              <Td>10408429925</Td>
              <Td>A</Td>
              <Td>Há 2 anos</Td>
            </Tr>
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
}
