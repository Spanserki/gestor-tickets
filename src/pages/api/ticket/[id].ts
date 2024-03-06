import { prisma } from "@/lib/prisma";
import { GetDateWithFinalHour, GetDateWithInitialHour } from "@/utils/format";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, selectedInitialDate, selectedFinalDate } = req.query;
    
    const response = await prisma.ticketByEmployee.count({
        where: {
            employeeId: String(id),
            createdAt: {
                gte: !!selectedInitialDate ? GetDateWithInitialHour(String(selectedInitialDate)) : undefined,
                lte: !!selectedFinalDate ? GetDateWithFinalHour(String(selectedFinalDate)) : undefined
            }
        },
    });
    res.json(response);
});

export default router.handler({
    onError: (err: any, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});