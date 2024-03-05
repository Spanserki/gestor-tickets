import { DistanceDate } from "@/utils/format";
import { Tooltip } from "@chakra-ui/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
    createdAT: string;
}

export default function SimpleToolip({ createdAT }: Props) {
    return (
        <Tooltip
            hasArrow
            placement="top"
            bg='gray.700'
            p={3}
            rounded={"md"}
            fontWeight='hairline'
            label={format(new Date(createdAT),
                "d 'de' LLLL',' yyyy 'ás' HH:mm'h",
                { locale: ptBR })}
        >
            {DistanceDate(createdAT)}
        </Tooltip>
    )
}