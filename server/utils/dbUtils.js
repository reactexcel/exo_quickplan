import { db } from '../data/database';
import config from '../config/environment';

async function traversWithFilter(fromLevel, toLevel, direction = 'OUTBOUND', startVertex, usebfs = false, filterCollection) {
  const aqlQuery = `
  FOR vertex IN @fromLevel..@toLevel ${direction} @startVertex GRAPH @graph OPTIONS {bfs: @usebfs}
    FILTER IS_SAME_COllECTION(@filterCollection, vertex)
    RETURN vertex`;

  const result = await db.query(aqlQuery, {
    fromLevel,
    toLevel,
    startVertex,
    graph: config.arango.databaseName,
    usebfs,
    filterCollection });
  return await result.all();
}

async function traversWithoutFilter(fromLevel, toLevel, direction = 'OUTBOUND', startVertex, usebfs = false) {
  const aqlQuery = `
  FOR vertex IN @fromLevel..@toLevel ${direction} @startVertex GRAPH @graph OPTIONS {bfs: @usebfs}
    RETURN vertex`;

  const result = await db.query(aqlQuery, {
    fromLevel,
    toLevel,
    startVertex,
    graph: config.arango.databaseName,
    usebfs });
  return await result.all();
}

export { traversWithFilter, traversWithoutFilter };
