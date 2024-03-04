import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const handler = createRouter<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    const { name, cpf } = req.body;
    // const verifyEmployee = await prisma.employee.findUnique({
    //     where: {
    //         cpf: cpf.toString().replace(/\.|-/gm, '')
    //     }
    // })
    // console.log(verifyEmployee)
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