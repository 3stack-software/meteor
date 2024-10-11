import { AccountsServer } from "./accounts_server.js";

/**
 * @namespace Accounts
 * @summary The namespace for all server-side accounts-related methods.
 */
const Accounts = new AccountsServer(Meteor.server);
// TODO[FIBERS]: I need TLA
Accounts.init().then();

// Users table. Don't use the normal autopublish, since we want to hide
// some fields. Code to autopublish this is in accounts_server.js.
// XXX Allow users to configure this collection name.

/**
 * @summary A [Mongo.Collection](#collections) containing user documents.
 * @locus Anywhere
 * @type {Mongo.Collection}
 * @importFromPackage meteor
*/
export const Meteor$users = Accounts.users;

/**
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.
 * @locus Anywhere but publish functions
 * @importFromPackage meteor
 */
export const Meteor$userId = () => Accounts.userId();

/**
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.
 * @locus Anywhere but publish functions
 * @importFromPackage meteor
 * @param {Object} [options]
 * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.
 */
export const Meteor$user = options => Accounts.user(options);

/**
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.
 * @locus Anywhere but publish functions
 * @importFromPackage meteor
 * @param {Object} [options]
 * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.
 */
export const Meteor$userAsync = options => Accounts.userAsync(options);

export {
  Accounts,
  // Since this file is the main module for the server version of the
  // accounts-base package, properties of non-entry-point modules need to
  // be re-exported in order to be accessible to modules that import the
  // accounts-base package.
  AccountsServer
};
