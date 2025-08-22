const generatePassword = require('../fns/generate-password');
const modelOrganization = require('../model/organization');
const serviceUser = require('./user');

class ServiceOrganization {

    async FindById(id, transaction) {
        return modelOrganization.findByPk(id, { transaction })
    }

    async Create(name, address, phone, email, transaction) {
        if (!name) {
            throw new Error("Name is required");
        } else if (!address) {
            throw new Error("Address is required");
        } else if (!phone) {
            throw new Error("Phone is required");
        } else if (!email) {
            throw new Error("Email is required");
        }

        const organization = await modelOrganization.create(
            { name, address, phone, email },
            { transaction }
        );

        const password = generatePassword();
        const user = await serviceUser.Create(
            organization.id,
            `Admin ${name}`,
            email,
            password,
            "admin",
            transaction
        )

        return {organization, user: { ...user.dataValues, password }};
    }

    async Update(id, name, address, phone, email, transaction) {
        const organization = await this.FindById(id, transaction);
        if (!organization) {
            throw new Error("Organization not found");
        }

        organization.name = name || organization.name;
        organization.address = address || organization.address;
        organization.phone = phone || organization.phone;
        organization.email = email || organization.email;

        return organization.save({ transaction });
    }

    async Delete(id, transaction) {
        const organization = await this.FindById(id, transaction);
        if (!organization) {
            throw new Error("Organization not found");
        }

        return organization.destroy({ transaction });
    }

}

module.exports = new ServiceOrganization();