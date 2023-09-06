const items = require("./fakeData")

class Item {
    constructor(name, price){
        this.name = name;
        this.price = price;
        // track all items
        items.push(this);
    }
     static findAll(){
        return items
     }
     // Update item when matching name to data
     static update(name, data){
        let foundItem = Item.find(name);
        if (foundItem === undefined){
            throw {message: "Item Not Found", status: 404}

        }
        foundItem.name = data.name;
        foundItem.price = data.price;

        return foundItem;
     }
     //find and return matching item
     static find(name){
        const foundItem = items.find(v => v.name === name);
        if (foundItem === undefined){
            throw {message: "Item Not Found", status: 404}
        }
        return foundItem 
     } 
     //remove item with matching ID
     static remove(name){
        let foundId = items.findIndex(v => v.name === name);
        if (foundId === -1){
            throw {message: "item Id not Found", status: 404}
        }
        items.splice(foundId, 1)
     }
    }
module.exports = Item;