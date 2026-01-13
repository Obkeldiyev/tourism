import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@errors";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const client = new PrismaClient();

export class AdminController {
    static async getAllAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await client.admin.findMany();

            res.status(200).send({
                success: true,
                message: "Admins retrieved successfully",
                data: admins
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async createAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            const checkAdmin = await client.admin.findUnique({
                where: {
                    username
                }
            });

            if (checkAdmin) {
                res.status(400).send({
                    success: false,
                    message: "Admin with this username already exists"
                });
            } else {
                await client.admin.create({
                    data: {
                        username,
                        password
                    }
                });

                res.status(201).send({
                    success: true,
                    message: "Admin created successfully"
                });
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async getAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.headers;

            const data = verify(token as string, process.env.SECRET_KEY as string) as { id: string };

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!admin) {
                return res.status(404).send({
                    success: false,
                    message: "Admin not found"
                });
            }

            res.status(200).send({
                success: true,
                message: "Admin account retrieved successfully",
                data: admin
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async editUsername(req: Request, res: Response, next: NextFunction) {
        try {
            const { oldUsername, newUsername } = req.body;
            const { token } = req.headers;

            const data: any = verify(token as string, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!admin) {
                return res.status(404).send({
                    success: false,
                    message: "Admin not found"
                });
            }

            if (admin.username !== oldUsername) {
                return res.status(400).send({
                    success: false,
                    message: "Old username does not match"
                });
            }

            const newUsernameCheck = await client.admin.findUnique({
                where: {
                    username: newUsername
                }
            });

            if (newUsernameCheck) {
                return res.status(400).send({
                    success: false,
                    message: "New username is already taken"
                });
            }

            await client.admin.update({
                where: {
                    id: data.id
                },
                data: {
                    username: newUsername
                }
            });

            res.status(200).send({
                success: true,
                message: "Username updated successfully"
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async editPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { oldPassword, newPassword } = req.body;
            const { token } = req.headers;

            const data: any = verify(token as string, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if (!admin) {
                return res.status(404).send({
                    success: false,
                    message: "Admin not found"
                });
            }

            if (admin.password !== oldPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Old password does not match"
                });
            }

            await client.admin.update({
                where: {
                    id: data.id
                },
                data: {
                    password: newPassword
                }
            });

            res.status(200).send({
                success: true,
                message: "Password updated successfully"
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            
            const admin = await client.admin.findUnique({
                where: {
                    username,
                    password
                }
            });
            
            if (!admin || admin.password !== password) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            const token = sign(
                { id: admin.id, username: admin.username, role: admin.role },
                process.env.SECRET_KEY as string,
                { expiresIn: "7d" }
            );

            res.status(200).send({
                success: true,
                message: "Login successful",
                data: {
                    token
                }
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message || "Internal Server Error", error.status || 500));
        }
    }
}