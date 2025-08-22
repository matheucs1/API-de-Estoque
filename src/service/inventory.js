const getProductMovements = require("../fns/get-product-movements");
const modelInventory = require("../model/inventory");
const inventoryMovement = require("./inventoryMovement");

class ServiceInventory {
    async FindById(organizationId, id, transaction) {
        const inventory = await modelInventory.findOne(
            { where: { organizationId, id }},
            { transaction }
        )
        if (!inventory) {
            throw new Error("Inventory not found");
        }
        const movements = await inventoryMovement.FindAll(inventory.id, transaction)

        const result = getProductMovements(movements)
        
        return { ...inventory?.dataValues, ...result };
    };

    async FindAll(organizationId, transaction) {
        return modelInventory.findAll(
            { where: { organizationId}},
            {transaction }
        )
    };

    async Create(organizationId, name, transaction) {
        if (!organizationId) {
            throw new Error("Organization ID is required");
        } else if (!name) {
            throw new Error("Name is required");
        }
        return modelInventory.create(
            { organizationId, name },
            { transaction }
        )
    };

    async Update(organizationId, id, name, transaction) {
        const oldInventory = await modelInventory.findOne(
            { where: { organizationId, id }},
            { transaction }
        )

        if (!oldInventory) {
            throw new Error("Inventory not found");
        } else if (!name) {
            throw new Error("Name is required");
        }
        oldInventory.name = name || oldInventory.name;

        return oldInventory.save({ transaction });
    };

    async Delete(organizationId, id, transaction) {
        const oldInventory = await modelInventory.findOne(
            { where: { organizationId, id }},
            { transaction }
        )
        if (!oldInventory) {
            throw new Error("Inventory not found");
        }
        return oldInventory.destroy({ transaction });    
    };
}

module.exports = new ServiceInventory();