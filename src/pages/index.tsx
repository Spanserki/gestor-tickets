import SimpleToolip from "@/components/SimpleToollip";
import { GetEmployees } from "@/hooks/query";
import {
  Badge,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

export default function Home() {
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [searchName, setSearchName] = useState('')
  const [isLoadingButton, setIsLoadingButton] = useState('')
  const { data, isLoading, error, refetch } = GetEmployees(page, perPage, searchName)
  useEffect(() => {
    refetch();
  }, [page, perPage, data, searchName])
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
            onClick={() => setIsLoadingButton('T')}
            colorScheme="yellow"
            isLoading={isLoadingButton === 'T' ? true : false}
          >
            Tickets
          </Button>
          <Button
            colorScheme="green"
            as={Link}
            href='/employee/create'
            onClick={() => setIsLoadingButton('N')}
            isLoading={isLoadingButton === 'N' ? true : false}
          >
            Novo
          </Button>
        </HStack>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <Flex w='100%' justify='center'>
            <Text>Não foi possível carregar os conteúdos</Text>
          </Flex>
        ) : (
          <>
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
                {data?.results.map((item: any) => {
                  return (
                    <Tr>
                      <Td>{item.name}</Td>
                      <Td>{item.cpf}</Td>
                      <Td>
                        <Badge
                          colorScheme={item.situation === 'A' ? 'green' : 'red'}
                        >
                          {item.situation}
                        </Badge>
                      </Td>
                      <Td fontStyle='italic' fontSize='sm'>
                        <SimpleToolip createdAT={item.createdAt} />
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </>
        )}
      </Stack>
    </Stack>
  );
}
