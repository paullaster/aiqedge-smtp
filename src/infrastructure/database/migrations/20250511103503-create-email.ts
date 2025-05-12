'use strict';

import type { QueryInterface, } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('Emails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      to: {
        type: Sequelize.JSON,
        allowNull: false
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      html: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cc: {
        type: Sequelize.JSON
      },
      bcc: {
        type: Sequelize.JSON
      },
      replyTo: {
        type: Sequelize.STRING
      },
      inReplyTo: {
        type: Sequelize.STRING
      },
      references: {
        type: Sequelize.JSON
      },
      attachments: {
        type: Sequelize.JSON
      },
      headers: {
        type: Sequelize.JSON
      },
      priority: {
        type: Sequelize.STRING
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
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Emails');
  }
};