const { home_server_logs_channel, no_logs } = require("./config.json");
const { client } = require("./client");

let logChannel;

async function init() {
  logChannel = await client.channels
    .fetch(home_server_logs_channel)
    .catch(console.error);
  if (!logChannel) return { error: "could not find logs channel" };
}

function log(text, options = { warn: false, error: false }) {
  const esc = text?.replace?.(/`/gm, "");
  if (esc) {
    if (options.error) console.error(esc);
    else if (options.warn) console.warn(esc);
    else console.log(esc);
  }
  if (no_logs || !logChannel) return;
  const type = options.warn ? "fix" : options.error ? "diff" : "";
  const defaultType = !options.warn && !options.error;
  const prefix = options.error ? "-" : "";
  logChannel
    .send(
      `${defaultType ? "" : "```"}${type}\n${prefix + text}\n${
        defaultType ? "" : "```"
      }`
    )
    .catch(console.log);
}

function logError(errorText, errorOrigin) {
  log(
    `${errorText}${
      errorOrigin?.guild?.name
        ? ` | On server: [${errorOrigin?.guild?.name} - ${errorOrigin?.guild?.id}]`
        : ""
    }`,
    { error: true }
  );
}

module.exports = { initLogger: init, log, logError };
