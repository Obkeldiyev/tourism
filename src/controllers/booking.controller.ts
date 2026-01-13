import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@errors";

const client = new PrismaClient();

export class BookingController {
    static async getAllBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const bookings = await client.bookings.findMany();

            res.status(200).send({
                success: true,
                message: "Bookings retrieved successfully",
                data: bookings,
            });
        } catch (error: any) {
            next(
                new ErrorHandler(
                    error.message || "Internal Server Error",
                    error.status || 500
                )
            );
        }
    }

    static async getOneBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const booking = await client.bookings.findUnique({
                where: {
                    id,
                },
            });

            if (booking) {
                res.status(200).send({
                    success: true,
                    message: "Booking retrieved successfully",
                    data: booking,
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: "Booking not found",
                });
            }
        } catch (error: any) {
            next(
                new ErrorHandler(
                    error.message || "Internal Server Error",
                    error.status || 500
                )
            );
        }
    }

    static async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { tur_id, full_name, phone_number, seats_booked } = req.body;

            const booking = await client.bookings.create({
                data: {
                    tur_id,
                    full_name,
                    phone_number,
                    seats_booked,
                },
            });

            res.status(201).send({
                success: true,
                message: "Booking created successfully",
                data: booking,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }
}