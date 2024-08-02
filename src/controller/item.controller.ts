import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { ItemService } from "../services";
import { TYPES } from "../constants";

@controller('/items')
export class ItemController {

    constructor(
        @inject<ItemService>(TYPES.ItemService) private itemService: ItemService
    ) { }
    @httpPost('/')
    async addItems(req: Request, res: Response) {
        try {
            const { title, description } = req.body
            await this.itemService.addItems({ title, description })
            res.json({ status: true, message: "Item created" })
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
    @httpGet('/')
    async getItems(req: Request, res: Response) {
        try {
            const data = await this.itemService.getItems()
            res.json({ status: true, message: "Item fetched" , data})
        } catch (error) {
            res.json({ status: false, message: error.message })
        }
    }
}