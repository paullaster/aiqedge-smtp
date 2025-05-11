import { Model, Sequelize } from "sequelize";

'use strict';

/**
 * 
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
export default function (sequelize: Sequelize, DataTypes: any) {
    class EmailModel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        /**
         * 
         * @param {any} models 
         */
        static associate(models: any) {
        }
    }
    EmailModel.init({
        id: { type: DataTypes.BIGINT, primaryKey: true },
        to: DataTypes.JSON,
        from: DataTypes.STRING,
        subject: DataTypes.STRING,
        html: DataTypes.TEXT,
        cc: DataTypes.JSON,
        bcc: DataTypes.JSON,
        replyTo: DataTypes.STRING,
        inReplyTo: DataTypes.STRING,
        references: DataTypes.JSON,
        attachments: DataTypes.JSON,
        headers: DataTypes.JSON,
        priority: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Email',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['id']
            }
        ]
    });
    return EmailModel;
};