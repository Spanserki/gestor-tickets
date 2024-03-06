import { ExportCSV } from "@/components/ExportExcel";
import { ReactSelectSingle } from "@/components/ReactSelectSingle";
import { GetEmployee, GetTicketsById } from "@/hooks/query";
import { api } from "@/lib/api";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    Input,
    Spinner,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format, formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import * as yup from 'yup';

const handleSchemaValidation = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    cpf: yup.string().required('Campo obrigatório'),
    situation: yup.object().required('Campo obrigatório'),
})

const options = [
    { value: 'A', name: 'A' },
    { value: 'I', name: 'I' },
]

export default function CreateEmployee() {
    const router = useRouter();
    const toast = useToast();
    const client = useQueryClient();
    const { id } = router.query;
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [selectedInitialDate, setSelectedInitialDate] = useState<any>(addDays(new Date(), - 1));
    const [selectedFinalDate, setSelectedFinalDate] = useState<any>(new Date());
    const { data: tickets, refetch } = GetTicketsById(`${id}`, selectedInitialDate, selectedFinalDate)
    const { data, isLoading, error } = GetEmployee(`${id}`)

    useEffect(() => {
        refetch()
    }, [selectedInitialDate, selectedFinalDate])

    const dataFormat = data && data.ticket?.map((res: any) => ({
        CRIADO: format(new Date(res.createdAt), "d 'de' LLLL 'às' HH:mm'h'", {
            locale: ptBR,
        }),
    }))

    const { handleSubmit, reset, formState: { errors }, control } = useForm<any>({
        resolver: yupResolver(handleSchemaValidation)
    });

    const mutation = useMutation({
        mutationFn: async (values: any) => {
            const { name, cpf, situation } = values;
            try {
                await api.put(`/employee/${id}`, {
                    name,
                    cpf,
                    situation: situation.value
                }).then(res => {
                    toast({
                        title: 'Sucesso!',
                        description: `Cadastro atualizado 👍.`,
                        status: 'success',
                        duration: 7000,
                        isClosable: true,
                    });
                    setIsLoadingButton(false)
                    router.push('/')
                }).catch((err: any) => {
                    if (err.response.status === 409) {
                        setIsLoadingButton(false)
                        toast({
                            title: '😕',
                            description: `${err.response.data.message}`,
                            status: 'warning',
                            duration: 9000,
                            isClosable: true,
                        })
                        return
                    }
                    toast({
                        title: '😕',
                        description: 'Não conseguimos atualizar o cadastro.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    setIsLoadingButton(false)
                })
            } catch (error: any) {
                toast({
                    title: '😕',
                    description: `${error.response.data.message}`,
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                })
            }

        },
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['employee', id] })
        },
    })

    const handleUpdate = async (values: any) => {
        mutation.mutateAsync(values)
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
                    Dados do funcionário
                </Heading>
                <Stack
                    w='100%'
                >
                    <Stack
                        w='fit-content'
                        borderWidth={1}
                        p={4}
                        spacing={6}
                    >
                    </Stack>
                </Stack>
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <Flex w='100%' justify='center'>
                        <Text>Não foi possível carregar os conteúdos</Text>
                    </Flex>
                ) : (
                    <Flex
                        flexDir={{ base: 'column', md: 'column', lg: 'row' }}
                        w='100%'
                        gap={10}
                    >
                        <Stack
                            w='100%'
                            align='center'
                            maxW='4xl'
                            borderWidth={1}
                            p={4}
                            spacing={6}
                        >
                            <HStack>
                                <FormControl>
                                    <FormLabel fontSize='sm'>Data inicial</FormLabel>
                                    <DatePicker
                                        onChange={setSelectedInitialDate}
                                        selected={selectedInitialDate}
                                        showIcon
                                        customInput={<Input size="sm" width='32' />}
                                        locale={ptBR}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize='sm'>Data final</FormLabel>
                                    <DatePicker
                                        onChange={setSelectedFinalDate}
                                        selected={selectedFinalDate}
                                        showIcon
                                        customInput={<Input size="sm" width='32' />}
                                        locale={ptBR}
                                        dateFormat="dd/MM/yyyy"
                                    />
                                </FormControl>
                            </HStack>
                            <Stack align='center' spacing={4}>
                                <Heading fontSize='lg'>
                                    Tickets por periodo:
                                </Heading>
                                <Heading color='red'>
                                    {tickets}
                                </Heading>
                                {data?.ticket.length > 0 && <ExportCSV csvData={dataFormat} fileName="Relatório de tickets" />}
                            </Stack>
                        </Stack>
                        <Stack
                            as='form'
                            onSubmit={handleSubmit(handleUpdate)}
                            spacing={4}
                            w='100%'
                            fontSize='sm'
                            borderWidth={1}
                            p={4}
                        >
                            <HStack>
                                <FormControl isInvalid={!!errors.name?.message}>
                                    <FormLabel>Nome</FormLabel>
                                    <Controller
                                        control={control}
                                        name="name"
                                        defaultValue={data?.name}
                                        render={({ field: { value, onChange } }) => (
                                            <Input
                                                _hover={{ borderColor: 'gray.500' }}
                                                type='text'
                                                placeholder="Digite..."
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                    {!!errors.name?.message &&
                                        <FormErrorMessage>
                                            {`${errors.name.message}`}
                                        </FormErrorMessage>}
                                </FormControl>
                                <FormControl isInvalid={!!errors.cpf?.message}>
                                    <FormLabel>CPF</FormLabel>
                                    <Controller
                                        control={control}
                                        name="cpf"
                                        defaultValue={data?.cpf}
                                        render={({ field: { value, onChange } }) => (
                                            <Input
                                                _hover={{ borderColor: 'gray.500' }}
                                                as={InputMask}
                                                mask="***.***.***-**"
                                                maskChar={null}
                                                type="text"
                                                size="lg"
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                    {!!errors.cpf?.message &&
                                        <FormErrorMessage>
                                            {`${errors.cpf.message}`}
                                        </FormErrorMessage>}
                                </FormControl>
                            </HStack>
                            <HStack>
                                <Box
                                    w={{ base: '100%', lg: '50%' }}
                                >
                                    <ReactSelectSingle
                                        label="Situação"
                                        name="situation"
                                        object={options}
                                        defaultValue={data}
                                        control={control}
                                        error={errors.categoryId}
                                    />
                                </Box>
                            </HStack>
                            <HStack
                                w='100%'
                                justify='end'
                            >
                                <Button
                                    as={Link}
                                    href='/'
                                >
                                    Voltar
                                </Button>
                                <Button
                                    colorScheme="green"
                                    type="submit"
                                    isLoading={isLoadingButton}
                                >
                                    Salvar
                                </Button>
                            </HStack>
                        </Stack>
                    </Flex>

                )}
            </Stack>
        </Stack>
    )
}