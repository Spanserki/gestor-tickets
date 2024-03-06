import { Button, Icon } from "@chakra-ui/react";
import FileSaver from "file-saver";
import { useState } from "react";
import { RiAttachmentLine } from "react-icons/ri";
import * as XLSX from 'xlsx';

interface ExportCSVProps {
    csvData: string[];
    fileName: string;
}

export function ExportCSV({ csvData, fileName }: ExportCSVProps) {
    const [isLoading, setIsLoading] = useState(false);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtencion = '.xls'

    const exportToCSV = (csvData: string[], fileName: string) => {
        setIsLoading(true);
        const ws = XLSX.utils.json_to_sheet(csvData); //Cria a planilha com os dados recebidos
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] }; //Formatação do arquivo Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xls', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtencion);
        setIsLoading(false)
    };
    return (
        <Button
            w="fit-content"
            size="sm"
            isLoading={isLoading}
            colorScheme="red"
            variant='outline'
            leftIcon={<Icon as={RiAttachmentLine} />}
            onClick={(e) => exportToCSV(csvData, fileName)}
        >
            Exportar
        </Button>
    )
}