import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
    const { page = 1, perPage = 10, searchName } = req.query
    try {
        const count = await prisma.employee.count({
            where: {
                name: {
                    contains: String(searchName)
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const pageStart = (Number(page) - 1) * Number(perPage)
        const response = await prisma.employee.findMany({
            where: {
                name: {
                    contains: String(searchName),
                },
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: Number(pageStart),
            take: Number(perPage)
        })
        res.setHeader('x-total-count', count)
        res.send(response)
    } catch (error) {

    }
})

handler.post(async (req, res) => {
    const { name, cpf } = req.body;
    const verifyEmployee = await prisma.employee.findUnique({
        where: {
            cpf
        }
    })
    if (!!verifyEmployee) {
        return res.status(409).json({ message: 'CPF já cadastrado no sistema.' })
    }
    try {
        await prisma.employee.create({
            data: {
                name,
                cpf
            }
        })
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