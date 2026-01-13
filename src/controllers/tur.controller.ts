import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@errors";

const client = new PrismaClient();

export class TurController {
    static async getAllTurs(req: Request, res: Response, next: NextFunction) {
        try {
            const turs = await client.turs.findMany();

            res.status(200).send({
                success: true,
                message: "Turs retrieved successfully",
                data: turs
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async getOneTur(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const tur = await client.turs.findUnique({
                where: {
                    id
                },
                include: {
                    additional_info: true,
                    bookings: true
                }
            });

            if (tur) {
                res.status(200).send({
                    success: true,
                    message: "Tur retrieved successfully",
                    data: tur
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: "Tur not found"
                });
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }
    
    static async createTur(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }
}