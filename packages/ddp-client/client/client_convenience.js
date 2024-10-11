import { DDP } from '../common/namespace.js';
import { loadAsyncStubHelpers } from "./queueStubsHelpers";

// Meteor.refresh can be called on the client (if you're in common code) but it
// only has an effect on the server.
export const Meteor$refresh = () => {};

// By default, try to connect back to the same endpoint as the page
// was served from.
//
// XXX We should be doing this a different way. Right now we don't
// include ROOT_URL_PATH_PREFIX when computing ddpUrl. (We don't
// include it on the server when computing
// DDP_DEFAULT_CONNECTION_URL, and we don't include it in our
// default, '/'.) We get by with this because DDP.connect then
// forces the URL passed to it to be interpreted relative to the
// app's deploy path, even if it is absolute. Instead, we should
// make DDP_DEFAULT_CONNECTION_URL, if set, include the path prefix;
// make the default ddpUrl be '' rather that '/'; and make
// _translateUrl in stream_client_common.js not force absolute paths
// to be treated like relative paths. See also
// stream_client_common.js #RationalizingRelativeDDPURLs
const ddpUrl = __meteor_runtime_config__.DDP_DEFAULT_CONNECTION_URL || '/';

const retry = new Retry();

function onDDPVersionNegotiationFailure(description) {
  Meteor._debug(description);
  const migrationData = Reload._migrationData('livedata') || Object.create(null);
  let failures = migrationData.DDPVersionNegotiationFailures || 0;
  ++failures;
  Reload._onMigrate('livedata', () => [true, { DDPVersionNegotiationFailures: failures }]);
  retry.retryLater(failures, () => {
    Reload._reload({ immediateMigration: true });
  });
}

// Makes sure to inject the stub async helpers before creating the connection
loadAsyncStubHelpers();
export const Meteor$connection = DDP.connect(ddpUrl, {
  onDDPVersionNegotiationFailure: onDDPVersionNegotiationFailure
});

// Proxy the public methods of Meteor$connection so they can
// be called directly on Meteor.
export const Meteor$subscribe = Meteor$connection.subscribe.bind(Meteor$connection)
export const Meteor$methods = Meteor$connection.methods.bind(Meteor$connection)
export const Meteor$isAsyncCall = Meteor$connection.isAsyncCall.bind(Meteor$connection)
export const Meteor$call = Meteor$connection.call.bind(Meteor$connection)
export const Meteor$callAsync = Meteor$connection.callAsync.bind(Meteor$connection)
export const Meteor$apply = Meteor$connection.apply.bind(Meteor$connection)
export const Meteor$applyAsync = Meteor$connection.applyAsync.bind(Meteor$connection)
export const Meteor$status = Meteor$connection.status.bind(Meteor$connection)
export const Meteor$reconnect = Meteor$connection.reconnect.bind(Meteor$connection)
export const Meteor$disconnect = Meteor$connection.disconnect.bind(Meteor$connection)
