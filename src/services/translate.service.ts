import axios from "axios";

export type Lang = "uz" | "ru" | "en" | "kaa";

export class TranslateService {

    private static async translateText(
        text: string,
        target: Lang
    ): Promise<string> {

        if (target === "kaa") {
            return text;
        }

        const res = await axios.post<{ translatedText: string }>("https://libretranslate.com/translate", {
            q: text,
            source: "auto",
            target,
            format: "text"
        });

        return res.data.translatedText;
    }

    static async translateAll(text: string) {
        return {
            uz: text,
            ru: await this.translateText(text, "ru"),
            en: await this.translateText(text, "en"),
            kaa: await this.translateText(text, "kaa")
        };
    }
}
