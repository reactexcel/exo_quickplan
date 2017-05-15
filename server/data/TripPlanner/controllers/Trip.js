import { db } from '../../database';

const trips = db.collection('trips');

function getTrip(doc) {
  return trips.firstExample(doc);
}

async function getTrips() {
  const cursor = await trips.all();
  return cursor.all();
}

function addTrip(doc) {
  return trips.save(doc);
}

function updateTrip(_key, doc) {
  return trips.update(_key, doc);
}

export { getTrip, getTrips, addTrip, updateTrip };
