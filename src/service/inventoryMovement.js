const modelMovement = require("../model/inventoryMovement");
const product = require("../model/product");

const movementTypes = ['out', 'in'];

class ServiceMovement {
    async FindById(inventoryId, id, transaction) {
        return modelMovement.findOne(
            { where: { inventoryId, id } },
            { transaction }
        )

    };

    async FindAll(inventoryId, transaction) {
        return modelMovement.findAll(
            { where: { inventoryId }, include: { model: product } },
            { transaction, }
        )
    };

    async Create(inventoryId, userId, type, amount, productId, transaction) {
        if (!inventoryId) {
            throw new Error("Name is required");
        } else if (!userId) {
            throw new Error("User ID is required");
        } else if (!type || !movementTypes.includes(type)) {
            throw new Error(" Type is required and must be one of: " + movementTypes.join(", "));
        } else if (!amount) {
            throw new Error("Amount is required");
        } else if (!productId) {
            throw new Error("Product ID is required");
        }
        return modelMovement.create(
            { inventoryId, userId, type, amount, productId },
            { transaction }
        )
    };

    async Update(inventoryId, id, type, amount, transaction) {
        const oldInventoryMovement = await this.FindById(inventoryId, id, transaction)
        if (!oldInventoryMovement) {
            throw new Error("Estoque não foi encontrado")
        }
        if (type && !movementTypes.includes(type)) {
            throw new Error("Informe o tipo de movimentação corretamente")
        }

        oldInventoryMovement.type = type || oldInventoryMovement.type
        oldInventoryMovement.amount = amount || oldInventoryMovement.amount

        return oldInventoryMovement.save({ transaction })
    }

    async Delete(inventoryId, id, transaction) {
        const oldMovement = await this.FindById(inventoryId, id, transaction);

        if (!oldMovement) {
            throw new Error("Movement not found");
        }
        return oldMovement.destroy({ transaction });
    };
}


module.exports = new ServiceMovement();