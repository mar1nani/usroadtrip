import { createListService } from "./listService";
import defaultShopping from "../data/shopping.json";

const service = createListService("shopping", defaultShopping);

export const loadShopping = service.loadLists;
export const { addList, renameList, deleteList, addItem, updateItem, deleteItem } = service;
