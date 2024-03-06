import { prisma } from "@/lib/prisma";
import { GetDateWithFinalHour, GetDateWithInitialHour } from "@/utils/format";
import { addDays } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    try {
        const response = await prisma.ticket.findUnique({
            where: {
                id: 'b49388ef-609f-47e2-bb03-51b0f80e462c'
            },
            select: {
                quantity: true
            }
        })
        res.send(response)
        return res.status(200).json({ message: 'sucess' })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
})

handler.post(async (req, res) => {
    const { ticket, id } = req.body;
    const verifySituation = await prisma.employee.findUnique({
        where: {
            id
        }
    })
    const verifyQuantityTicket: any = await prisma.ticket.findUnique({
        where: { id: 'b49388ef-609f-47e2-bb03-51b0f80e462c' }
    })
    const verifyTicketByDay = await prisma.ticketByEmployee.findFirst({
        where: {
            employeeId: id,
            createdAt: {
                gte: GetDateWithInitialHour(String(new Date())),
            },
        },
    });
    if (verifyQuantityTicket?.quntity <= 0) {
        return res.status(409).json({ message: 'Quantidade de tickets insuficiente' })
    }
    if (verifySituation?.situation === 'I') {
        return res.status(409).json({ message: 'Usuário esta inativo' })
    }
    if (verifyTicketByDay) {
        return res.status(409).json({ message: 'Limite de tickets do dia atingido para este usuário' })
    }
    try {
        const response = await prisma.ticketByEmployee.create({
            data: {
                employeeId: id
            }
        })
        if (!!response) {
            await prisma.ticket.update({
                where: {
                    id: 'b49388ef-609f-47e2-bb03-51b0f80e462c'
                },
                data: {
                    quantity: {
                        decrement: Number(ticket)
                    }
                }
            })
        }
        return res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
})

export default handler.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});