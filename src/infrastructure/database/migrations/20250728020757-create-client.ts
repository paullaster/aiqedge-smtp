'use strict';

import type { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('Clients', {
      clientId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      smtpConfig: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface: QueryInterface, _Sequelize: any) {
    await queryInterface.dropTable('Clients');
  }
};