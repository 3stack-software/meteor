import { setConnectionOptions } from "./connection_options.js";
import { _collections, Collection, getCollection } from "./collection.js";
import { defaultRemoteCollectionDriver, RemoteCollectionDriver } from "./remote_collection_driver.js";
import { OplogHandle } from "./oplog_tailing.js";


export const Mongo = /*#__PURE__*/Object.freeze({
  Collection,
  Cursor: LocalCollection.Cursor,
  ObjectID: MongoID.ObjectID,
  setConnectionOptions,
  getCollection,
  _collections
});


export const MongoInternals = /*#__PURE__*/Object.freeze({
  defaultRemoteCollectionDriver,
  RemoteCollectionDriver,
  OplogHandle
});
