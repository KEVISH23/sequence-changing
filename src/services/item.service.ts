import { injectable } from "inversify";
import { Item } from "../models";

@injectable()
export class ItemService{
    async addItems(data:any){
        try {
            await Item.create(data)
        } catch (error) {
            throw(error)
        }
    }
    async getItems(){
        try {
            return await Item.find()
        } catch (error) {
            throw(error)
        }
    }
}