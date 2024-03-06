import { api } from "@/lib/api";
import {
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    useToast
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from 'yup';

interface Props {
    onClose: any;
    isOpen: any;
    id: string
}

const handleSchemaValidation = yup.object().shape({
    ticket: yup
        .number()
        .required('Campo obrigatório')
        .max(1, 'máximo 1 ticket')
        .min(1, 'Minimo 1 ticket')
        .typeError('Por favor, insira um número')
})

export default function ModalTicket({ onClose, isOpen, id }: Props) {
    const client = useQueryClient();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: yupResolver(handleSchemaValidation)
    });

    const mutation = useMutation({
        mutationFn: async ({ ticket }: any) => {
            setIsLoading(true)
            try {
                await api.post(`/ticket`, {
                    id,
                    ticket
                }).then(res => {
                    toast({
                        title: 'Sucesso!',
                        description: `Ticket adicionado 👍.`,
                        status: 'success',
                        duration: 7000,
                        isClosable: true,
                    });
                    setIsLoading(false)
                    onClose()
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
                        setIsLoading(false)
                        return
                    }
                    toast({
                        title: '😕',
                        description: 'Não conseguimos adicionar o ticket para este funcionário.',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    setIsLoading(false)
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
            client.invalidateQueries({ queryKey: ['tickets'] })
        },
    })

    const handleCreate = async (values: any) => {
        mutation.mutateAsync(values)
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Liberação de ticket</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack
                        as='form'
                        onSubmit={handleSubmit(handleCreate)}
                        spacing={4}
                    >
                        <FormControl isInvalid={!!errors.ticket?.message}>
                            <Input
                                _hover={{ borderColor: 'gray.500' }}
                                type='number'
                                placeholder="Quantidade"
                                defaultValue={1}
                                {...register('ticket')}
                            />
                            {!!errors.ticket?.message &&
                                <FormErrorMessage>
                                    {`${errors.ticket.message}`}
                                </FormErrorMessage>}
                        </FormControl>
                        <Button
                            colorScheme="green"
                            type="submit"
                            isLoading={isLoading}
                        >
                            Adicionar
                        </Button>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}