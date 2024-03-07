import EditButton from "@/components/EditButton";
import ModalTicket from "@/components/ModalTicket";
import SimpleToolip from "@/components/SimpleToollip";
import { GetEmployees, GetTickets, PrefetchEmployee } from "@/hooks/query";
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
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

export default function Home() {
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [searchName, setSearchName] = useState('')
  const [isLoadingButton, setIsLoadingButton] = useState('')
  const [editLoading, setEditLoading] = useState('');
  const [idModal, setIdModal] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: tickets } = GetTickets()
  const { data, isLoading, error, refetch } = GetEmployees(page, perPage, searchName)

  useEffect(() => {
    refetch();
  }, [page, perPage, data, searchName])

  async function handlePrefetch(id: string) {
    PrefetchEmployee(id)
  }
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
          <Button>
            Tickets disponíveis: {tickets?.quantity}
          </Button>
          <Button
            colorScheme="green"
            as={Link}
            href='/funcionario/criar'
            onClick={() => setIsLoadingButton('N')}
            isLoading={isLoadingButton === 'N' ? true : false}
          >
            Novo usuário
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
            <Stack
              w='100%'
              overflowX="auto"
            >
              <Table variant='simple' colorScheme="red" size='lg'>
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>CPF</Th>
                    <Th>Ativo</Th>
                    <Th>Criado</Th>
                    <Th>Atualizado</Th>
                    <Th>Ticket</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.results.map((item: any) => {
                    return (
                      <Tr key={item.id}>
                        <Td
                          _hover={{ textDecor: 'underline' }}
                        >
                          <Link
                            href={`/funcionario/${item.id}`}
                          >
                            {item.name}
                          </Link>
                        </Td>
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
                        <Td fontStyle='italic' fontSize='sm'>
                          {!!item.updatedAt && (
                            <SimpleToolip createdAT={item.updatedAt} />
                          )}
                        </Td>
                        <Td>
                          <Button
                            onClick={onOpen}
                            onMouseEnter={() => setIdModal(item.id)}
                            size='sm'
                            colorScheme="yellow"
                          >
                            Liberar Ticket
                          </Button>
                        </Td>
                        <Td>
                          <EditButton
                            id={item.id}
                            link={`/funcionario/${item.id}`}
                            editLoading={editLoading}
                            handlePrefetch={() => handlePrefetch(item.id)}
                            setEditloading={setEditLoading}
                          />
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Stack>

          </>
        )}
      </Stack>
      <ModalTicket
        isOpen={isOpen}
        onClose={onClose}
        id={idModal}
      />
    </Stack>
  );
}
