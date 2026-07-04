import { createListService } from "./listService";
import defaultChecklist from "../data/checklist.json";

const service = createListService("checklist", defaultChecklist);

export const loadChecklist = service.loadLists;
export const { addList, renameList, deleteList, addItem, updateItem, deleteItem } = service;
