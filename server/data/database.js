/* eslint-disable no-use-before-define, no-shadow, no-console */
import { Database } from 'arangojs';
import config from '../config/environment';
import startCron from '../crontab';

const db = new Database({ url: config.arango.url });
const exoGraph = config.arango.databaseName;

const graphDef = {
  edgeDefinitions: [
    {
      collection: 'bookIn',
      from: ['proposals', 'trips', 'countryBookings', 'cityBookings', 'accommodationPlacements', 'cityDays', 'serviceBookings', 'transferPlacements'],
      to: ['trips', 'countryBookings', 'cityBookings', 'accommodationPlacements', 'cityDays', 'serviceBookings', 'roomConfigs', 'transferPlacements']
    },
    {
      collection: 'use',
      from: ['serviceBookings', 'accommodationPlacements'],
      to: ['suppliers', 'tours', 'accommodations']
    },
    {
      collection: 'preselect',
      from: ['accommodationPlacements', 'cityDays', 'transferPlacements'],
      to: ['accommodations', 'tours', 'transfers']
    },
    {
      collection: 'supply',
      from: ['suppliers'],
      to: ['accommodations', 'tours', 'transfers']
    },
    {
      collection: 'participate',
      from: ['proposals', 'trips', 'countryBookings', 'serviceBookings', 'roomConfigs'],
      to: ['paxs']
    },
    {
      collection: 'transfer',
      from: ['cityBookings', 'transferPlacements', 'trips'],
      to: ['transferPlacements', 'cityBookings', 'trips']
    },
    {
      collection: 'locatedIn',
      from: ['offices', 'locations', 'proposals', 'trips', 'countryBookings', 'tours', 'accommodations'],
      to: ['locations']
    },
    {
      collection: 'workedBy',
      from: ['proposals'],
      to: ['users']
    },
    {
      collection: 'worksFor',
      from: ['users'],
      to: ['offices']
    },
    {
      collection: 'records',
      from: ['serviceBookings', 'countryBookings', 'paxs', 'trips'],
      to: ['activities']
    },
    {
      collection: 'selectedFor',
      from: ['offices'],
      to: ['tours']
    },
    {
      collection: 'error',
      from: ['roomConfigs'],
      to: ['paxs']
    }
  ],
  orphanCollections: ['currencyRates']
};

async function connect() {
  try {
    // Connect to a database
    if (config.seed) {
      await _createDatabase(config.arango.databaseName);
      db.useDatabase(config.arango.databaseName);
    } else {
      db.useDatabase(config.arango.databaseName);
    }
    if (config.createGraph) {
      await _createGraph(exoGraph);
    }
    console.log('Database has been connected');

    startCron();
  } catch (err) {
    console.error(err.stack);
  }
}

// Create a database
async function _createDatabase(databaseName) {
  const listDatabases = await db.listDatabases();
  if (listDatabases.indexOf(databaseName) !== -1) await db.dropDatabase(databaseName);
  await db.createDatabase(databaseName);
}

// Create Exo-Create Graph
async function _createGraph(graphName) {
  try {
    // If old graph exists then drop it.
    const graph = await db.graph(graphName);
    graph.drop();
    // Create new graph.
    const exoGraph = db.graph(graphName);
    await exoGraph.create(graphDef);
  } catch (e) {
    console.log(e.stack);
  }
}

export { connect, db };

