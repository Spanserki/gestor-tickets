import { ReactSelectSingle } from "@/components/ReactSelectSingle";
import { GetEmployee } from "@/hooks/query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
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
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
    const { id } = router.query;
    const { data, isLoading, error, refetch } = GetEmployee(`${id}`)
    const toast = useToast();
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const { handleSubmit, reset, formState: { errors }, control } = useForm<any>({
        resolver: yupResolver(handleSchemaValidation)
    });

    const handleUpdate = async (values: any) => {
        setIsLoadingButton(true)
        const { name, cpf, situation } = values;
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
            reset();
            setIsLoadingButton(false)
            queryClient.invalidateQueries('employees')
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
                {isLoading ? (
                    <Spinner />
                ) : error ? (
                    <Flex w='100%' justify='center'>
                        <Text>Não foi possível carregar os conteúdos</Text>
                    </Flex>
                ) : (
                    <Stack
                        as='form'
                        onSubmit={handleSubmit(handleUpdate)}
                        spacing={4}
                        w='100%'
                        fontSize='sm'
                    >
                        <HStack>
                            <FormControl isInvalid={!!errors.name?.message}>
                                <FormLabel>Nome</FormLabel>
                                <Controller
                                    control={control}
                                    name="name"
                                    defaultValue={data?.name}
                                    render={({ field: { value } }) => (
                                        <Input
                                            _hover={{ borderColor: 'gray.500' }}
                                            type='text'
                                            placeholder="Digite..."
                                            value={value}
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
                )}
            </Stack>
        </Stack>
    )
}