const modelProduct = require("../model/product");

class ServiceProduct {
    async FindById(organizationId, id, transaction) {
        return modelProduct.findOne(
            { where: { organizationId, id } },
            { transaction }
        )
    };

    async FindAll(organizationId, transaction) {
        return modelProduct.findAll(
            { where: { organizationId } },
            { transaction }
        )
    };

    async Create(organizationId, name, description, transaction) {
        if (!organizationId) {
            throw new Error("organizationId is required");
        } else if (!name) {
            throw new Error("name is required");
        } else if (!description) {
            throw new Error("description is required");
        }
        return modelProduct.create(
            { organizationId, name, description },
            { transaction }
        )

    };

    async Update(organizationId, id, name, description, transaction) {
        const oldProduct = await this.FindById(organizationId, id);

        if (!oldProduct) {
            throw new Error("Product not found");
        }
        oldProduct.name = name || oldProduct.name;
        oldProduct.description = description || oldProduct.description;
        return oldProduct.save({ transaction });

    };

    async Delete(organizationId, id, transaction) {
        const oldProduct = await this.FindById(organizationId, id);

        if (!oldProduct) {
            throw new Error("Product not found");
        }
        await oldProduct.destroy({ transaction });
    };
}

module.exports = new ServiceProduct();
