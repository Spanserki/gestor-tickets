import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { RiPencilLine } from "react-icons/ri";
import NextLink from 'next/link'

interface EditButtonProps {
    id: string;
    link: string;
    editLoading: string;
    setEditloading: any;
    handlePrefetch: (id: string) => {};
}

export default function EditButton({
    id,
    link,
    editLoading,
    setEditloading,
    handlePrefetch
}: EditButtonProps) {
    return (
        <Tooltip
            cursor="help"
            label={'Clique para editar'}
            aria-label="A tooltip"
            placement="top"
        >
            <Button
                as={NextLink}
                href={link}
                onClick={() => setEditloading(`${id}`)}
                onMouseEnter={() => handlePrefetch(`${id}`)}
                isLoading={editLoading === id}
                size='xs'
                type="submit"
                transition='0.3s'
                _hover={{ opacity: '0.7' }}
                colorScheme="blue"
            >
                <Icon as={RiPencilLine} />
            </Button>
        </Tooltip>
    )
}