import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const response = await prisma.employee.findUnique({
        where: {
            id: String(id)
        },
        include: {
            ticket: true
        }
    });
    res.json(response);
});

// router.use(isAuth).patch(async (req, res) => {
//     const { id, isPublished } = req.body
//     await prisma.post.update({
//         where: { id },
//         data: {
//             isPublished: !isPublished
//         }
//     })
//     res.send({})
// })

router.put(async (req, res) => {
    const { id } = req.query;
    const { name, cpf, situation } = req.body
    const verifyEmployee = await prisma.employee.findUnique({
        where: {
            cpf
        }
    })
    if (!!verifyEmployee && verifyEmployee.id != id) {
        return res.status(409).json({ message: 'CPF já cadastrado no sistema.' })
    }
    try {
        await prisma.employee.update({
            where: {
                id: String(id)
            },
            data: {
                name,
                cpf,
                situation
            },
        })
        return res.status(200).json({ message: 'success' })
    } catch (error) {
        return res.status(400).json({ message: error })
    }
});

// router.delete(async (req: NextApiRequest, res: NextApiResponse) => {
//     const { id } = req.query;
//     const response = await prisma.post.delete({
//         where: {
//             id: String(id)
//         },
//     });
//     res.json(response);
// });

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});