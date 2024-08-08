import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { SectionService } from "../services";
import { TYPES } from "../constants";
import { isValidObjectId } from "mongoose";

@controller('/section')
export class SectionController {

    constructor(
        @inject<SectionService>(TYPES.SectionService) private sectionService: SectionService
    ) { }

    @httpPost('/')
    async addSection(req: Request, res: Response) {
        try {
            const { sectionName } = req.body
            await this.sectionService.addSection({ sectionName })
            res.json({ status: true, message: 'Section created' })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    @httpGet('/')
    async getSection(req: Request, res: Response) {
        try {
            const data = await this.sectionService.getSection()
            res.json({ status: true, data, message: "Data fetched" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }

    @httpDelete('/delete/:id')
    async deleteSection(req: Request, res: Response) {
        try {
            const { id } = req.params
            if (!isValidObjectId(id)) {
                throw new Error('Id is not Valid')
            }
            await this.sectionService.deleteSection(id)
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
            if(sequence==undefined || sequence==null){
                throw new Error('Sequence not provided')
            }
            await this.sectionService.updateSectionSequence(id,sequence)
            res.json({ status: true, message: "Sequence Update" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
}