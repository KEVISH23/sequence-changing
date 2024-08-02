import { Container } from "inversify";
import { ContentService, SectionService,ItemService } from "./services";
import { TYPES } from "./constants";
const container = new Container()


container.bind<SectionService>(TYPES.SectionService).to(SectionService)
container.bind<ContentService>(TYPES.ContentService).to(ContentService)
container.bind<ItemService>(TYPES.ItemService).to(ItemService)
export { container }