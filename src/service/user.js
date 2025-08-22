const modelUser = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const roles = ['admin', 'employee'];
const salt = 12;
const secretKey = process.env.SECRET;

class ServiceUser {
    async FindAll(organizationId, transaction) {
        return modelUser.findAll({
            where: { organizationId },
            transaction
        });
    }

    async FindById(organizationId, id, transaction) {
        return modelUser.findOne({
            where: { organizationId, id },
            transaction
        });
    }

    async Create(organizationId, name, email, password, role, transaction) {

        if (!organizationId) {
            throw new Error("Organization ID is required");
        } else if (!name) {
            throw new Error("Name is required");
        } else if (!email) {
            throw new Error("Email is required");
        } else if (!password) {
            throw new Error("Password is required");
        } else if (!role || !roles.includes(role)) {
            throw new Error("Role is required");
        }

        const hashPass = await bcrypt.hash(password, salt);

        return modelUser.create({
            organizationId,
            name,
            email,
            password: hashPass,
            role,

        }, { transaction });

    }

    async Update(organizationId, id, name, email, password, role, transaction) {
        const oldUser = await this.FindById(organizationId, id, transaction);
        if (!oldUser) {
            throw new Error("User not found");
        }

        if (role && !roles.includes(role)) {
            throw new Error("Role is required");
        }

        if (role && oldUser.role === "admin") {
            oldUser.role = role || oldUser.role;
        }
        oldUser.name = name || oldUser.name;
        oldUser.email = email || oldUser.email;
        oldUser.password = password ? await bcrypt.hash(password, salt) : oldUser.password;

        return await oldUser.save({ transaction });
    }
    async Delete(organizationId, id, transaction) {
        const deletedUser = await this.FindById(organizationId, id, transaction);
        if (!deletedUser) {
            throw new Error("User not found");
        }
        deletedUser.destroy({ transaction });
        return deletedUser;
    }

    async Login(email, password, transaction) {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        const user = await modelUser.findOne(
            { where: { email } },
            { transaction }
        );

        if (!user) {
            throw new Error("User or password is invalid");
        }
        const verify = await bcrypt.compare(password, user.password);
        if (verify) {
            return jwt.sign({
                id: user.id,
                role: user.role,
                organizationId: user.organizationId
            }, secretKey, { expiresIn: 60 * 60 });// 1 hour
        }
        throw new Error("User or password is invalid");
    }
    async Verify(id, role, transaction) {
        return modelUser.findAll(
            { where: { id, role } }, { transaction });
    }

}

module.exports = new ServiceUser();