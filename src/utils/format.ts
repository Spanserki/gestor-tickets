import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FormatDate(date: string) {
    const defaultValue = format(new Date(date), "yyyy-MM-dd'T'HH:mm");
    return defaultValue;
}

export function DistanceDate(date: string) {
    const publishedAt = formatDistanceToNow(new Date(date), {
        locale: ptBR,
        addSuffix: true
    })
    return publishedAt;
}

export function GetDateWithInitialHour(date:string){
    return format(new Date(String(date)), "yyyy-MM-dd'T'00:00:00'.000Z'")
   }
  
  export function GetDateWithFinalHour(date:string){
   return format(new Date(String(date)), "yyyy-MM-dd'T'23:59:59'.000Z'")
  }