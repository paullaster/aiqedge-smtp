'use strict';

import { Model, type Sequelize } from "sequelize";


export default function (sequelize: Sequelize, DataTypes: any) {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models: any) {
      // define association here
    }
  }
  Client.init({
    clientId: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    clientName: DataTypes.STRING,
    service: DataTypes.STRING,
    smtpConfig: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Client',
    timestamps: true,
  });
  return Client;
};