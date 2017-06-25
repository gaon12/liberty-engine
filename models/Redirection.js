'use strict';

const Sequelize = require('sequelize');
const LibertyModel = require('./LibertyModel');
const models = require('./');

class Redirection extends LibertyModel {
  static init(sequelize) {
    super.init({
      sourceNamespaceId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      sourceTitle: {
        primaryKey: true,
        type: Sequelize.STRING(128),
        allowNull: false,
      },

      /**
       * lowercased source title.
       *
       * @property lowercaseSourceTitle
       * @readOnly
       * @type String
       */
      lowercaseSourceTitle: 'VARCHAR(128) AS (lower(`sourceTitle`)) PERSISTENT',

      destinationArticleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'redirection',
      indexes: [{
        fields: ['destinationArticleId'],
      }, {
        fields: ['lowercaseSourceTitle'],
      }],
    });
  }
  /**
   * Describes associations.
   * @method associate
   * @static
   */
  static associate() {
    this.belongsTo(models.Namespace, { as: 'sourceNamespace' });
    this.belongsTo(models.Article, {
      as: 'destinationArticle',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

module.exports = Redirection;
