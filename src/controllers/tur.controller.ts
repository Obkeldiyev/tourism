import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@errors";
import { TranslateService } from "../services/translate.service";

const client = new PrismaClient();

export class TurController {
  static async getAllTurs(req: Request, res: Response, next: NextFunction) {
    try {
      const turs = await client.turs.findMany();

      res.status(200).send({
        success: true,
        message: "Turs retrieved successfully",
        data: turs,
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

  static async getOneTur(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const tur = await client.turs.findUnique({
        where: {
          id,
        },
        include: {
          additional_info: true,
          bookings: true,
        },
      });

      if (tur) {
        res.status(200).send({
          success: true,
          message: "Tur retrieved successfully",
          data: tur,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Tur not found",
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

  static async createTur(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        breakfast,
        lunch,
        dinner,
        wifi,
        transport,
        start_date,
        end_date,
        cost,
        description,
        phone_number,
        messanger_id,
        max_seats,
        additional_info,
      } = req.body;

      // 🌍 Translate ONCE
      const titleT = await TranslateService.translateAll(title);
      const descT = await TranslateService.translateAll(description);

      const newTur = await client.turs.create({
        data: {
          title_uz: titleT.uz,
          title_ru: titleT.ru,
          title_en: titleT.en,
          title_kaa: titleT.kaa,

          description_uz: descT.uz,
          description_ru: descT.ru,
          description_en: descT.en,
          description_kaa: descT.kaa,

          breakfast,
          lunch,
          dinner,
          wifi,
          transport,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          cost,
          phone_number,
          messanger_id,
          max_seats,
        },
      });

      // 📸 Save photos
      if (req.files && Array.isArray(req.files)) {
        const photosData = req.files.map((file: any) => ({
          url: `/uploads/turs/${file.filename}`,
          tur_id: newTur.id,
        }));

        await client.photos.createMany({ data: photosData });
      }

      // ℹ️ Additional info (still single language — can extend later)
      if (additional_info && additional_info.length > 0) {
        const additionalInfoData = additional_info.map((info: any) => ({
          info_title: info.info_title,
          info_description: info.info_description,
          tur_id: newTur.id,
        }));

        await client.additional_info.createMany({ data: additionalInfoData });
      }

      res.status(201).send({
        success: true,
        message: "Tur created successfully",
        data: newTur,
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

  static async editTur(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        title,
        breakfast,
        lunch,
        dinner,
        wifi,
        transport,
        start_date,
        end_date,
        cost,
        description,
        phone_number,
        messanger_id,
        max_seats,
        additional_info,
      } = req.body;

      const checkTur = await client.turs.findUnique({ where: { id } });

      if (!checkTur) {
        return res.status(404).send({
          success: false,
          message: "Tur not found",
        });
      }

      const data: any = {
        breakfast,
        lunch,
        dinner,
        wifi,
        transport,
        cost,
        phone_number,
        messanger_id,
        max_seats,
      };

      if (start_date) data.start_date = new Date(start_date);
      if (end_date) data.end_date = new Date(end_date);

      // 🌍 Translate ONLY if changed
      if (title) {
        const t = await TranslateService.translateAll(title);
        data.title_uz = t.uz;
        data.title_ru = t.ru;
        data.title_en = t.en;
        data.title_kaa = t.kaa;
      }

      if (description) {
        const d = await TranslateService.translateAll(description);
        data.description_uz = d.uz;
        data.description_ru = d.ru;
        data.description_en = d.en;
        data.description_kaa = d.kaa;
      }

      const tur = await client.turs.update({
        where: { id },
        data,
      });

      // 🔁 Replace photos if provided
      if (req.files && Array.isArray(req.files)) {
        await client.photos.deleteMany({ where: { tur_id: id } });

        const photosData = req.files.map((file: any) => ({
          url: `/uploads/turs/${file.filename}`,
          tur_id: id,
        }));

        await client.photos.createMany({ data: photosData });
      }

      // 🔁 Replace additional info
      if (additional_info && additional_info.length > 0) {
        await client.additional_info.deleteMany({ where: { tur_id: id } });

        const additionalInfoData = additional_info.map((info: any) => ({
          info_title: info.info_title,
          info_description: info.info_description,
          tur_id: id,
        }));

        await client.additional_info.createMany({ data: additionalInfoData });
      }

      res.status(200).send({
        success: true,
        message: "Tur updated successfully",
        data: tur,
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

  static async deleteTur(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const checkTur = await client.turs.findUnique({
        where: {
          id,
        },
      });

      if (!checkTur) {
        return res.status(404).send({
          success: false,
          message: "Tur not found",
        });
      }

      await client.turs.delete({
        where: {
          id,
        },
      });

      res.status(200).send({
        success: true,
        message: "Tur deleted successfully",
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
}
