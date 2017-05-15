import request, { POST } from '../../../utils/request';
import config from '../../../config/environment';
import { db } from '../../database';
import {
  addServiceBooking,
  getServiceBookings,
  remove as removeServiceBooking
} from '../../ServiceBooking/controllers/ServiceBooking';

const graph = db.graph(config.arango.databaseName);
const cityDays = graph.vertexCollection('cityDays');

const bookInEdgeCollection = db.edgeCollection('bookIn');

function updateServicesByCityDayKey(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/cityday/patch-tours-by-city-day-key', POST, args);
}

function togglePreselection(args) {
  return request('http://localhost:8529/_db/exo-dev/bbt/cityday/toggle-preselect-tour', POST, args);
}

function getCityDay(args) {
  return request(`${config.foxx.url}/cityday/get-tours-by-city-day-key`, POST, args);
}

async function selectServiceBookings({ cityDayKey, slot, tourKeys, selectedServiceBookingKeys }) {
  // Case when TC select the tours from preselection tour which is not default choosed by TA.
  // will new ServiceBooking for those tours, and mark the unselected bookIn edge as inactive=true
  if (tourKeys && tourKeys.length) {
    const newServices = await Promise.all(tourKeys.map(tour => addServiceBooking({
      cityDayKey,
      slot,
      ...tour
    })));
    selectedServiceBookingKeys = (selectedServiceBookingKeys || []).concat(newServices.map(service => service._key)); // eslint-disable-line no-param-reassign
  }

  // update the select book In edge as inactive=false,  update unselect as inactive=true;
  const aqlQuery = `
     LET startSlot = document(concat('serviceBookings/', @selectedServiceBookingKeys[0])).startSlot
     FOR vertex, edge IN outBOUND @cityDayId bookIn
       FILTER IS_SAME_COLLECTION ('serviceBookings', vertex) AND vertex.startSlot == startSlot
       LET active = POSITION(@selectedServiceBookingKeys, vertex._key)
       UPDATE edge WITH { inactive:  !active } IN bookIn
  `;
  const result = await db.query(aqlQuery, {
    cityDayId: `cityDays/${cityDayKey}`,
    selectedServiceBookingKeys: selectedServiceBookingKeys || []
  });

  return { cityDayKey, slot };
}


const remove = async (cityDayKey) => {
  // get and remove cityDay serviceBookings
  const serviceBookings = await getServiceBookings(`cityDays/${cityDayKey}`);
  await Promise.all(serviceBookings.map(({ _key }) => removeServiceBooking(_key)));

  return cityDays.remove(cityDayKey);
};


async function getCityDays(vertexId) {
  const aqlQuery = `
    FOR vertex, edge
    IN 1..1 OUTBOUND @vertexId
    GRAPH 'exo-dev'
    FILTER
      IS_SAME_COLLECTION('cityDays', vertex) AND
      IS_SAME_COLLECTION('bookIn', edge)
    RETURN vertex
  `;

  const result = await db.query(aqlQuery, { vertexId });
  return result.all();
}

const changeNote = async ({ cityDayKey, note }) => {
  const aqlQuery = `
    FOR cityDay in cityDays
      FILTER cityDay._id == @cityDayId
      UPDATE cityDay WITH { note: @note } IN cityDays
      RETURN NEW
  `;

  const result = await db.query(aqlQuery, {
    cityDayId: `cityDays/${cityDayKey}`,
    note
  });

  return result.next();
};

async function addMeal({ cityDayKey, mealOrder, mealType, mealNote }) {
  const cityDay = await cityDays.firstExample({ _key: cityDayKey });
  if (!cityDay.timeSlots) {
    cityDay.timeSlots = [{
      slotOrder: 1,
      meal: { type: 'No meal arranged' }
    }, {
      slotOrder: 2,
      meal: { type: 'No meal arranged' }
    }, {
      slotOrder: 3,
      meal: { type: 'No meal arranged' }
    }];
  }
  const timeSlot = cityDay.timeSlots.find(timeSlot => timeSlot.slotOrder === mealOrder);
  timeSlot.meal = { type: mealType, note: mealNote };
  await cityDays.updateByExample({ _key: cityDayKey }, cityDay);
  return cityDay;
}

function updateCityDays(key, unavailableSlots) {
  cityDays.updateByExample({ _key: key.toString() }, { unavailableSlots });
  return {};
}

export {
  updateServicesByCityDayKey,
  togglePreselection,
  getCityDay,
  selectServiceBookings,
  remove,
  getCityDays,
  changeNote,
  addMeal,
  updateCityDays
};
