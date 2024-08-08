import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { isValidObjectId } from "mongoose";
import { ContentService } from "../services";
import { TYPES } from "../constants";

@controller('/content')
export class ContentController {
    constructor(
        @inject<ContentService>(TYPES.ContentService) private contentService: ContentService
    ) { }
    @httpPost('/addContent')
    async addContent(req: Request, res: Response) {
        try {
            const { sectionId, itemId, buttonText, buttonBgColor, buttonTextColor, isFree, freeBadgeColor, freeBadgeBgColor } = req.body
            if (sectionId && !isValidObjectId(sectionId)) {
                throw new Error("Section Id is invalid")
            }
            if (itemId && !isValidObjectId(itemId)) {
                throw new Error("Item Id is invalid")
            }
            await this.contentService.addContent({ sectionId, itemId, buttonText, buttonBgColor, buttonTextColor, isFree, freeBadgeColor, freeBadgeBgColor })
            res.json({ status: true, message: "Content Created" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    @httpPost('/getContent')
    async getAllContent(req: Request, res: Response) {
        try {
            const { sectionId } = req.body
            
            const data = await this.contentService.getAllContent(sectionId)
            res.json({ status: true, data, message: "Retrieved data" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    @httpDelete('/delete/:id')
    async deleteContent(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (!isValidObjectId(id)) {
                throw new Error('Id is not Valid')
            }
            await this.contentService.deleteContent(id)
            res.json({ status: true, message: "Deleted the section" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    @httpPut('/update/:id')
    async changeSequence(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { sequence } = req.body
            if (!isValidObjectId(id)) {
                throw new Error('Id(s) provided are not valid')
            }
            if (sequence==undefined || sequence==null) {
                throw new Error('Sequence not provided')
            }
            await this.contentService.updateContentSequence(id, sequence)
            res.json({ status: true, message: "Sequence Update" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
}