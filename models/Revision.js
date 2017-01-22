/**
 * Provides Revision model.
 *
 * @module models
 * @submodule Revision
 */

'use strict';

const ip = require('ip');
const models = require('./');

/**
 * Model representing revisions.
 *
 * @class Revision
 */
module.exports = function(sequelize, DataTypes) {
  const Revision = sequelize.define('revision', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    changedLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('new', 'updated', 'renamed', 'deleted'),
      allowNull: false
    },
    ipAddress: {
      type: 'VARBINARY(16)',
      allowNull: false,
      set(ipAddress) {
        this.setDataValue('ipAddress', ip.toBuffer(ipAddress));
      },
      get() {
        return ip.toString(this.getDataValue('ipAddress'));
      }
    }
  }, {
    classMethods: {
      /**
       * Describes associations.
       * @method associate
       * @static
       * @param {Object} models
       */
      associate(models) {
        Revision.belongsTo(models.Wikitext, {
          foreignKey: { allowNull: true }
        });
        Revision.belongsTo(models.Article, {
          foreignKey: { allowNull: false }
        });
        Revision.belongsTo(models.User, {
          as: 'author',
          foreignKey: { allowNull: false }
        });
        Revision.hasOne(models.RenameLog, {
          onDelete: 'CASCADE', onUpdate: 'CASCADE'
        });
      },

      /**
       * Create a new revision and make it latest revision of an article.
       * @method createNew
       * @static
       * @param {Object} option
       * @param {User} option.article an article to change.
       * @param {User} option.author user writing this.
       * @param {String} option.text text.
       * @param {String} option.ipAddress IP address of request.
       * @param {String} option.status one of 'new', 'updated', 'renamed', or 'deleted'.
       * @param {String} option.destinationFullTitle full title to rename.
       * @return {Promise<Revision>} Returns a promise of new revision.
       */
      createNew({ article, author, ipAddress, text, status, destinationFullTitle }) {
        return Promise.resolve()
        .then(() => {
          switch (status) {
            case 'new': {
              return models.Wikitext.replaceOnSave({ article, author, text, status })
              .then((replacedText) => {
                return models.Wikitext.create({ text: replacedText })
                .then((wikitext) => {
                  return this.create({
                    authorId: author.id,
                    articleId: article.id,
                    wikitextId: wikitext.id,
                    changedLength: wikitext.text.length,
                    ipAddress: ipAddress,
                    status: status
                  });
                });
              });
            }
            case 'updated': {
              return models.Wikitext.replaceOnSave({ article, author, text, status })
              .then((replacedText) => {
                return article.getLatestRevision({ includeWikitext: true })
                .then((baseRevision) => {
                  return models.Wikitext.create({ text: replacedText })
                  .then((wikitext) => {
                    return this.create({
                      authorId: author.id,
                      articleId: article.id,
                      wikitextId: wikitext.id,
                      changedLength: wikitext.text.length - baseRevision.wikitext.text.length,
                      ipAddress: ipAddress,
                      status: status
                    });
                  });
                });
              });
            }
            case 'renamed': {
              const { namespace, title } = models.Namespace.splitFullTitle(destinationFullTitle);
              return article.getLatestRevision({ includeWikitext: false })
              .then((baseRevision) => {
                return this.create({
                  authorId: author.id,
                  changedLength: 0,
                  wikitextId: baseRevision.wikitextId,
                  articleId: article.id,
                  ipAddress: ipAddress,
                  status: status,
                  renameLog: {
                    sourceNamespaceId: article.namespaceId,
                    sourceTitle: article.title,
                    destinationNamespaceId: namespace.id,
                    destinationTitle: title
                  }
                }, {
                  include: [models.RenameLog]
                });
              });
            }
            case 'deleted': {
              return article.getLatestRevision({ includeWikitext: true })
              .then((baseRevision) => {
                return this.create({
                  authorId: author.id,
                  changedLength: -baseRevision.wikitext.text.length,
                  wikitextId: null,
                  articleId: article.id,
                  ipAddress: ipAddress,
                  status: status
                });
              });
            }
            default:
              throw new TypeError('No such status');
          }
        })
        .then((newRevision) => {
          return article.update({ latestRevisionId: newRevision.id });
        });
      }
    }
  });
  return Revision;
};
