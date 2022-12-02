const fse = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

const DATABASE_FILE = path.resolve(__dirname, "./db.json");
const BASE_STRUCTURE = {};

const handleEventEmit = (event) => {
  fse.ensureFileSync(DATABASE_FILE);
  let uuid;

  let data = {};
  try {
    data = fse.readJsonSync(DATABASE_FILE);
  } catch (error) {
    data = {};
  }
  if (!data.events) {
    data.events = [];
  }
  if (!data.users) {
    data.users = [];
  }

  if (event.type === "identify") {
    data.users.push(event.payload);
    // session UUID
    uuid = crypto.randomUUID();
  } else {
    data.events.push(event);
  }

  fse.writeJsonSync(DATABASE_FILE, data, {
    spaces: 2,
  });

  return uuid;
};

const getUserEvents = (email) => {
  let data = {};
  try {
    data = fse.readJsonSync(DATABASE_FILE);
  } catch (error) {
    data = {};
  }

  const events = data.events.filter((entry) => entry?.user?.email === email);
  return events;
};

const getJourneyEvents = (name) => {
  // journey-events
  let data = {};
  try {
    data = fse.readJsonSync(DATABASE_FILE);
  } catch (error) {
    data = {};
  }

  const journeys = data.events.filter(
    (entry) => entry?.type.match(/^journey-/) && entry?.journeyName === name
  );
  const groups = journeys.reduce((acc, curr) => {
    if (!acc[curr.journeyId]) {
      return {
        ...acc,
        [curr.journeyId]: [curr],
      };
    }

    return {
      ...acc,
      [curr.journeyId]: [...acc[curr.journeyId], curr],
    };
  }, {});
  return groups;
};

getEventsByTime = (startTimestamp, endTimestamp) => {
  let data = {};
  try {
    data = fse.readJsonSync(DATABASE_FILE);
  } catch (error) {
    data = {};
  }

  let startIndex = 0;
  if (startTimestamp) {
    const firstEventIndex = data.events.findIndex(
      ({ timestamp }) => timestamp > startTimestamp
    );
    startIndex = firstEventIndex < 0 ? data.events.length : firstEventIndex;
  }

  let endIndex = data.events.length;
  if (endTimestamp) {
    const lastEventIndex = data.events.findIndex(({ timestamp }) => {
      return !(timestamp < endTimestamp);
    });

    endIndex = lastEventIndex < 0 ? data.events.length : lastEventIndex;
  }

  return data.events.slice(startIndex, endIndex);
};

const getEventsByDate = (startTimestamp, endTimestamp) => {
  return getEventsByTime(startTimestamp, endTimestamp);
};

const getActiveUsers = (startTimestamp, endTimestamp) => {
  const events = getEventsByTime(startTimestamp, endTimestamp);
  const activeUsers = events.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.user.id]: 1,
    };
  }, {});
  return activeUsers;
};

const generateEmptyHeatMap = () =>
  [...Array(7)].reduce((acc, _, index) => {
    return {
      ...acc,
      [index + 1]: [...Array(24)].fill({ count: 0, activeSessions: [] }),
    };
  }, {});

const getUserActivityHeatmap = (startTimestamp, endTimestamp) => {
  const events = getEventsByTime(startTimestamp, endTimestamp);
  const activeByDays = events.reduce((acc, curr) => {
    const eventDate = new Date(curr.timestamp);
    const eventDay = eventDate.getDay();
    const eventHour = eventDate.getHours();
    const eventSession = curr.sessionId;
    const sessionDatapoint = { ...acc[eventDay][eventHour] };
    if (!sessionDatapoint.activeSessions.includes(eventSession)) {
      sessionDatapoint.activeSessions.push(eventSession);
      sessionDatapoint.count += 1;
    }
    return {
      ...acc,
      [eventDay]: acc[eventDay].map((val, index) =>
        index === eventHour ? sessionDatapoint : val
      ),
    };
  }, generateEmptyHeatMap());
  return activeByDays;
};

const getPageEvents = (startTimestamp, endTimestamp) => {
  const events = getEventsByTime(startTimestamp, endTimestamp);
  return events.filter(({ type }) => type === "page");
};

module.exports.getPageEvents = getPageEvents;
module.exports.getUserActivityHeatmap = getUserActivityHeatmap;
module.exports.getActiveUsers = getActiveUsers;
module.exports.getEventsByDate = getEventsByDate;
module.exports.getJourneyEvents = getJourneyEvents;
module.exports.getUserEvents = getUserEvents;
module.exports.handleEventEmit = handleEventEmit;
