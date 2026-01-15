import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorHandler } from "@errors";

const client = new PrismaClient();

export class TurController {
  static async getAllTurs(req: Request, res: Response, next: NextFunction) {
    try {
      const turs = await client.turs.findMany({
        include: {
          photos: true,
          additional_info: true,
        },
      });

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
          photos: true,
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
      console.log('Creating tour with data:', req.body);
      console.log('Files received:', req.files);
      
      const {
        title_uz,
        title_kaa,
        title_ru,
        title_en,
        description_uz,
        description_kaa,
        description_ru,
        description_en,
        breakfast,
        lunch,
        dinner,
        wifi,
        transport,
        start_date,
        end_date,
        cost,
        phone_number,
        messanger_id,
        max_seats,
        additional_info,
      } = req.body;

      // ----------------- VALIDATION -----------------
      if (
        !title_uz ||
        !title_kaa ||
        !title_ru ||
        !title_en ||
        !description_uz ||
        !description_kaa ||
        !description_ru ||
        !description_en ||
        !transport ||
        !start_date ||
        !end_date
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const newTur = await client.turs.create({
        data: {
          title_uz,
          title_kaa,
          title_ru,
          title_en,
          description_uz,
          description_kaa,
          description_ru,
          description_en,
          breakfast: breakfast === 'true' || breakfast === true,
          lunch: lunch === 'true' || lunch === true,
          dinner: dinner === 'true' || dinner === true,
          wifi: wifi === 'true' || wifi === true,
          transport,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          cost: Number(cost) || 0,
          phone_number: phone_number || "",
          messanger_id: messanger_id || "",
          max_seats: Number(max_seats) || 0,
        },
      });

      console.log('Tour created:', newTur);

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        console.log('Processing files:', req.files.length);
        const photosData = req.files.slice(0, 15).map((file: any) => ({
          url: `/uploads/turs/${file.filename}`,
          tur_id: newTur.id,
        }));
        await client.photos.createMany({ data: photosData });
        console.log('Photos created:', photosData.length);
      }

      if (
        additional_info &&
        typeof additional_info === 'string'
      ) {
        try {
          console.log('Processing additional_info:', additional_info);
          const parsedInfo = JSON.parse(additional_info);
          if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
            const additionalInfoData = parsedInfo.map((info: any) => ({
              info_title_uz: info.info_title_uz || "",
              info_description_uz: info.info_description_uz || "",
              info_title_kaa: info.info_title_kaa || "",
              info_description_kaa: info.info_description_kaa || "",
              info_title_ru: info.info_title_ru || "",
              info_description_ru: info.info_description_ru || "",
              info_title_en: info.info_title_en || "",
              info_description_en: info.info_description_en || "",
              tur_id: newTur.id,
            }));
            await client.additional_info.createMany({ data: additionalInfoData });
            console.log('Additional info created:', additionalInfoData.length);
          }
        } catch (parseError) {
          console.error('Error parsing additional_info:', parseError);
        }
      }

      return res.status(201).json({
        success: true,
        message: "Tour created successfully",
        data: newTur,
      });
    } catch (error: any) {
      console.error('Error creating tour:', error);
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
    }
  }

  static async editTur(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        title_uz,
        title_kaa,
        title_ru,
        title_en,
        description_uz,
        description_kaa,
        description_ru,
        description_en,
        breakfast,
        lunch,
        dinner,
        wifi,
        transport,
        start_date,
        end_date,
        cost,
        phone_number,
        messanger_id,
        max_seats,
        additional_info,
      } = req.body;

      const checkTur = await client.turs.findUnique({ where: { id } });
      if (!checkTur) {
        return res
          .status(404)
          .json({ success: false, message: "Tur not found" });
      }

      const data: any = {
        title_uz: title_uz || checkTur.title_uz,
        title_kaa: title_kaa || checkTur.title_kaa,
        title_ru: title_ru || checkTur.title_ru,
        title_en: title_en || checkTur.title_en,
        description_uz: description_uz || checkTur.description_uz,
        description_kaa: description_kaa || checkTur.description_kaa,
        description_ru: description_ru || checkTur.description_ru,
        description_en: description_en || checkTur.description_en,
        breakfast: breakfast !== undefined ? !!breakfast : checkTur.breakfast,
        lunch: lunch !== undefined ? !!lunch : checkTur.lunch,
        dinner: dinner !== undefined ? !!dinner : checkTur.dinner,
        wifi: wifi !== undefined ? !!wifi : checkTur.wifi,
        transport: transport || checkTur.transport,
        start_date: start_date ? new Date(start_date) : checkTur.start_date,
        end_date: end_date ? new Date(end_date) : checkTur.end_date,
        cost: cost !== undefined ? Number(cost) : checkTur.cost,
        phone_number: phone_number || checkTur.phone_number,
        messanger_id: messanger_id || checkTur.messanger_id,
        max_seats:
          max_seats !== undefined ? Number(max_seats) : checkTur.max_seats,
      };

      const tur = await client.turs.update({ where: { id }, data });

      if (req.files && Array.isArray(req.files)) {
        await client.photos.deleteMany({ where: { tur_id: id } });
        const photosData = req.files.slice(0, 15).map((file: any) => ({
          url: `/uploads/turs/${file.filename}`,
          tur_id: id,
        }));
        await client.photos.createMany({ data: photosData });
      }

      if (additional_info && typeof additional_info === 'string') {
        try {
          const parsedInfo = JSON.parse(additional_info);
          if (Array.isArray(parsedInfo)) {
            await client.additional_info.deleteMany({ where: { tur_id: id } });
            const infoData = parsedInfo.map((info: any) => ({
              info_title_uz: info.info_title_uz || "",
              info_description_uz: info.info_description_uz || "",
              info_title_kaa: info.info_title_kaa || "",
              info_description_kaa: info.info_description_kaa || "",
              info_title_ru: info.info_title_ru || "",
              info_description_ru: info.info_description_ru || "",
              info_title_en: info.info_title_en || "",
              info_description_en: info.info_description_en || "",
              tur_id: id,
            }));
            await client.additional_info.createMany({ data: infoData });
          }
        } catch (parseError) {
          console.error('Error parsing additional_info:', parseError);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Tur updated successfully",
        data: tur,
      });
    } catch (error: any) {
      console.error(error);
      next(new ErrorHandler(error.message || "Internal Server Error", 500));
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
