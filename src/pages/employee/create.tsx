import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Heading,
    Input,
    Stack,
    useToast
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import * as yup from 'yup';

const handleSchemaValidation = yup.object().shape({
    name: yup.string().required('Campo obrigatório'),
    cpf: yup.string().required('Campo obrigatório'),
})

export default function CreateEmployee() {
    const router = useRouter();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<any>({
        resolver: yupResolver(handleSchemaValidation)
    });
    const handleCreate = async (values: any) => {
        setIsLoading(true)
        const { name, cpf } = values;
        await api.post('/employee', {
            name,
            cpf
        }).then(res => {
            toast({
                title: 'Sucesso!',
                description: `Funcionário criado 👍.`,
                status: 'success',
                duration: 7000,
                isClosable: true,
            });
            reset();
            reset({ cpf: "" })
            setIsLoading(false)
            queryClient.invalidateQueries(['getEmployees'])
            router.push('/')
        }).catch((err: any) => {
            if (err.response.status === 409) {
                setIsLoading(false)
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
                description: 'Não conseguimos cadastrar o funcionário.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsLoading(false)
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
                    Novo funcionário
                </Heading>
                <Stack
                    as='form'
                    onSubmit={handleSubmit(handleCreate)}
                    spacing={4}
                    w='100%'
                    fontSize='sm'
                >
                    <Stack
                        direction={{ base: 'column', lg: 'row' }}
                    >
                        <FormControl isInvalid={!!errors.name?.message}>
                            <FormLabel>Nome</FormLabel>
                            <Input
                                _hover={{ borderColor: 'gray.500' }}
                                type='text'
                                placeholder="Digite..."
                                {...register('name')}
                            />
                            {!!errors.name?.message &&
                                <FormErrorMessage>
                                    {`${errors.name.message}`}
                                </FormErrorMessage>}
                        </FormControl>
                    </Stack>
                    <FormControl isInvalid={!!errors.cpf?.message}>
                        <FormLabel>CPF</FormLabel>
                        <Input
                            _hover={{ borderColor: 'gray.500' }}
                            as={InputMask}
                            mask="***.***.***-**"
                            maskChar={null}
                            type="text"
                            placeholder="Digite..."
                            size="lg"
                            {...register('cpf')}
                        />
                        {!!errors.cpf?.message &&
                            <FormErrorMessage>
                                {`${errors.cpf.message}`}
                            </FormErrorMessage>}
                    </FormControl>
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
                            isLoading={isLoading}
                        >
                            Salvar
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
        </Stack>
    )
}