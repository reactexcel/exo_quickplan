/* eslint-disable no-console */

// The cloned trip will have all of the same product placements, preselections...
// trip with all of tis relationships. set trip status to draft.
// include all country bookings. clear: qpBookingId, tpBookingId, tpBookingRef.
// all city bookings
// all cityDay, accommodationPlacement, transferPlacement
// all serviceBooking.  Clear: status

import { db } from '../../database';

const tripsCollection = db.collection('trips');
const countryBookingsCollection = db.collection('countryBookings');
const cityBookingsCollection = db.collection('cityBookings');
const transferPlacementsCollection = db.collection('transferPlacements');
const cityDaysCollection = db.collection('cityDays');
const accommodationPlacementsCollection = db.collection('accommodationPlacements');
const serviceBookingsCollection = db.collection('serviceBookings');

const bookInEdgeCollection = db.edgeCollection('bookIn');
const participateEdgeCollection = db.edgeCollection('participate');
const locatedInEdgeCollection = db.edgeCollection('locatedIn');
const transferEdgeCollection = db.edgeCollection('transfer');
const preselectEdgeCollection = db.edgeCollection('preselect');
const useEdgeCollection = db.edgeCollection('use');

// clone Trip document and clone trip--BookIn-->countryBooking edges
async function cloneTrip(tripId) {
  // Query full information of trips, including document and all country bookings.
  const oldTrip = await queryTripAll(tripId);
  // clone all the injected CountryBookings field, and other metadata of oldTrip.
  const newCountryBookings = await cloneCountryBookings(oldTrip.countryBookings);

  cleanDoc(oldTrip, ['countryBookings']);
  const countryOrder = newCountryBookings.map(countryBooking => countryBooking._key);
  const newTrip = Object.assign({}, oldTrip, {
    countryOrder, // new countryOrder
    status: 'Draft',
    // createdOn: newDate(),
    updatedOn: newDate()
  });
  const handle = await tripsCollection.save(newTrip);

  // import new trip--BookIn-->countryBooking edges
  const edges = newCountryBookings.map(countryBooking => ({ _from: handle._id, _to: countryBooking._id }));
  await bookInEdgeCollection.import(edges);

  return handle;
}

// query all trips and related edges in one query for Optimization.
async function queryTripAll(tripId) {
  const aqlQuery = `
  LET trip = DOCUMENT(@tripId)
  LET tripCountryOrder = NOT_NULL(trip.countryOrder) ? trip.countryOrder : []
  LET countryBookings = (
    FOR countryBookingKey IN tripCountryOrder
      LET countryBookingId = CONCAT('countryBookings/', countryBookingKey)
      LET countryBooking = DOCUMENT(countryBookingId)
      LET countryBookingCityOrder = NOT_NULL(countryBooking.cityOrder) ? countryBooking.cityOrder : []
      RETURN MERGE(countryBooking, {
        locatedInIds: (FOR vertex, edge IN OUTBOUND countryBookingId locatedIn RETURN edge._to)
      }, {cityBookings: (
        FOR cityBookingKey IN countryBookingCityOrder
          LET cityBookingId = CONCAT('cityBookings/', cityBookingKey)
          LET cityBooking = DOCUMENT(cityBookingId)
          LET cityBookingEdges = (FOR vertex, edge IN OUTBOUND cityBookingId bookIn RETURN edge)
          LET theAccommodationPlacements = (
              FOR cityBookingEdge IN cityBookingEdges
                FOR accommodationPlacement IN accommodationPlacements
                  FILTER accommodationPlacement._id == cityBookingEdge._to
                LET supplyEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id use RETURN edge)
                LET accommodationsEdges = (FOR vertex, edge IN OUTBOUND accommodationPlacement._id preselect RETURN edge)
                RETURN MERGE(accommodationPlacement,
                    {supplier: FIRST(
                        FOR supplyEdge IN supplyEdges
                      FOR supplier IN suppliers
                        FILTER supplyEdge._to == supplier._id
                        RETURN supplier._id)},
                    {accommodations: (
                        FOR accommodationsEdge in accommodationsEdges
                            FOR accommodation in accommodations
                            FILTER accommodationsEdge._to == accommodation._id
                            RETURN accommodation._id)},
                      { serviceBookings: (
                    LET serviceBookingEdges = (FOR vertex, edge IN OUTBOUND cityBookingEdge._to bookIn RETURN edge)
                    FOR serviceBookingEdge IN serviceBookingEdges
                    FOR serviceBooking IN serviceBookings
                      FILTER serviceBooking._id == serviceBookingEdge._to
                      RETURN MERGE(serviceBooking,
                          { useEdgesIds: (
                            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)
                            FOR edge IN useEdges
                              RETURN edge._to)},
                         { bookInEdgesIds: (
                            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)
                            FOR edge IN bookInEdges
                              RETURN edge._to
                              )})
                    )}
                )
            )
          LET cityBookingDayOrder = NOT_NULL(cityBooking.dayOrder) ? cityBooking.dayOrder : []
          LET theCityDays = (
            FOR cityDayKey IN cityBookingDayOrder
              LET cityDayId = CONCAT('cityDays/', cityDayKey)
              LET cityDay = DOCUMENT(cityDayId)
              RETURN MERGE(cityDay,
                { serviceBookings: (
                  LET serviceBookingIds = (FOR vertex, edge IN OUTBOUND cityDay._id bookIn RETURN edge)
                  FOR serviceBookingId IN serviceBookingIds
                    FOR serviceBooking IN serviceBookings
                      FILTER serviceBooking._id == serviceBookingId._to
                      RETURN MERGE(serviceBooking,
                          { useEdgesIds: (
                            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)
                            FOR edge IN useEdges
                              RETURN edge._to)},
                         { bookInEdgesIds: (
                            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)
                            FOR edge IN bookInEdges
                              RETURN edge._to
                              )})
                )},
                { tours: (
                    LET toursEdges = ( FOR vertx, edge in OUTBOUND cityDayId preselect RETURN edge )
                    FOR toursEdge in toursEdges
                        return toursEdge._to)
                })
          )
          RETURN MERGE(cityBooking, {locatedInIds: (FOR vertex, edge IN OUTBOUND cityBookingId locatedIn RETURN edge._to)},
              {accommodationPlacements: theAccommodationPlacements, cityDays: theCityDays})
        )})
      )
      RETURN MERGE(trip, {countryBookings: countryBookings})
  `;

  const result = await db.query(aqlQuery, {
    tripId
  });

  return result.next();
}

// clone the all countryBookings concurrently, return a new ordered countryBookings
// and clone the TransferPlacements between new cityBookings.
async function cloneCountryBookings(oldcountryBookings) {
  const countryBookings = await Promise.all(oldcountryBookings.map(
    async (oldCountryBooking, idx) => {
      const newCountryBooking = await cloneCountryBooking(oldCountryBooking);
      return { order: idx, newCountryBooking };
    }
  ));
  // ordered countryBookings
  const newCountryBookings = countryBookings.sort((a, b) => a.order - b.order).map(item => item.newCountryBooking);

  // all cityBookings in all the countryBookings in Order, clone all transfers between the cities
  let allCityBookingsInOrder = [];
  newCountryBookings.map((countryBooking) => { allCityBookingsInOrder = allCityBookingsInOrder.concat(countryBooking.newCityBookings); return allCityBookingsInOrder; });
  if (allCityBookingsInOrder.length > 0) {
    await cloneTransferPlacements(allCityBookingsInOrder);
  }

  return newCountryBookings;
}

// Clone Country Booking document and output edges.
// Edge 1. countryBooking--BookIn-->cityBooking edges
// Edge 2. countryBooking--locatedIn-->locations
async function cloneCountryBooking(oldCountryBooking) {
  // clone all the bookIn cityBookings
  const newCityBookings = await cloneCityBookings(oldCountryBooking.cityBookings);
  const locatedInIds = oldCountryBooking.locatedInIds;

  // clear the injected edges field 'cityBookings' and locatedInIds
  // clear: qpBookingId, tpBookingId, tpBookingRef.
  cleanDoc(oldCountryBooking, ['qpBookingId', 'tpBookingId', 'tpBookingRef', 'cityBookings', 'locatedInIds']);
  const cityOrder = newCityBookings.map(cityBooking => cityBooking._key);
  const newCountryBooking = Object.assign({}, oldCountryBooking, {
    cityOrder, // new cityOrder
    updatedOn: newDate()
  });
  const handle = await countryBookingsCollection.save(newCountryBooking);

  // import new countryBooking--BookIn-->cityBooking edges
  const edges = newCityBookings.map(cityBooking => ({ _from: handle._id, _to: cityBooking._id }));
  await bookInEdgeCollection.import(edges);

  // import new countryBooking--locatedIn-->locations edges.
  const locatedInEdges = locatedInIds.map(locationId => ({ _from: handle._id, _to: locationId }));
  await locatedInEdgeCollection.import(locatedInEdges);
  return { ...handle, newCityBookings };
}

// clone the all cityBookings concurrently, return a new ordered cityBookings
async function cloneCityBookings(oldCityBookings) {
  const newCityBookings = await Promise.all(oldCityBookings.map(
    async (oldCityBooking, idx) => {
      const newCityBooking = await cloneCityBooking(oldCityBooking);
      return { order: idx, newCityBooking };
    }
  ));
  return newCityBookings.sort((a, b) => a.order - b.order).map(item => item.newCityBooking);
}

// clone CityBooking document, and the output edges.
// Edge 1: cityBooking --bookin--> cityDay
// Edge 2: cityBooking --bookin--> accommodationPlacement
// Edge 3: cityBooking --locatedIn--> locations
async function cloneCityBooking(oldCityBooking) {
  // clone all the output Vertices of this cityBooking
  const locatedInIds = oldCityBooking.locatedInIds;
  const oldCityBookingId = oldCityBooking._id;
  const oldCityDays = oldCityBooking.cityDays;
  const oldAccommodationPlacements = oldCityBooking.accommodationPlacements;
  const newOutputVertices = { cityDays: [], accommodationPlacements: [] };
  await Promise.all([
    cloneCityDays(oldCityDays, newOutputVertices),
    cloneAccommodationPlacements(oldAccommodationPlacements, newOutputVertices)]);

  // Clear the injected edges fields
  cleanDoc(oldCityBooking, ['cityDays', 'accommodationPlacements', 'locatedInIds']);
  const newDayOrder = newOutputVertices.cityDays.map(cityDay => cityDay._key); // new dayOrder
  const newCityBookingToSave = Object.assign({}, oldCityBooking, { dayOrder: newDayOrder });
  const handle = await cityBookingsCollection.save(newCityBookingToSave);

  // bookin edges
  const bookInEdges = [];
  // Edge 1: cityBooking --bookin--> cityDay
  newOutputVertices.cityDays.map(cityDay => bookInEdges.push({ _from: handle._id, _to: cityDay._id }));
  // Edge 2: cityBooking --bookin--> accommodationPlacement
  newOutputVertices.accommodationPlacements.map(cityDay => bookInEdges.push({ _from: handle._id, _to: cityDay._id }));
  if (bookInEdges && bookInEdges.length) {
    await bookInEdgeCollection.import(bookInEdges);
  }

  // Edge 3: cityBooking --locatedIn--> locations
  const locatedInEdges = locatedInIds.map(locationId => ({ _from: handle._id, _to: locationId }));
  await locatedInEdgeCollection.import(locatedInEdges);
  return { ...handle, oldCityBookingId };
}

// clone all city days following the old order concurrently, set the result to
// newOutputVertices.cityDays
async function cloneCityDays(oldCityDays, newOutputVertices) {
  const newCityDays = await Promise.all(oldCityDays.map(
      async (oldCityDay, idx) => {
        const newCityDay = await cloneCityDay(oldCityDay);
        return { order: idx, newCityDay };
      }
  ));
  newOutputVertices.cityDays = newCityDays.sort((a, b) => a.order - b.order).map(item => item.newCityDay); // eslint-disable-line no-param-reassign
}

// Clone CityDay document and output Edges,
// Edge 1: cityday --preselect--> tours.
// Edge 2: cityday --bookin--> serviceBookings
async function cloneCityDay(oldCityDay) {
  const oldServiceBookings = oldCityDay.serviceBookings;
  const newServiceBookings = await cloneServiceBookings(oldServiceBookings);
  // the tours data is live load from real data.
  const oldToursIds = oldCityDay.tours;

  // Clone this transferPlacement document
  cleanDoc(oldCityDay, ['serviceBookings', 'tours']);
  const newCityDay = Object.assign({}, oldCityDay);
  const handle = await cityDaysCollection.save(newCityDay);

  // save new cityday --bookin--> serviceBookings edge.
  const bookInEdges = newServiceBookings.map(serviceBooking => ({ _from: handle._id, _to: serviceBooking._id }));
  if (bookInEdges && bookInEdges.length) {
    await bookInEdgeCollection.import(bookInEdges);
  }

  // save new cityday --preselect--> tour edge.
  const preselectEdges = oldToursIds.map(tourId => ({ _from: handle._id, _to: tourId }));
  if (preselectEdges && preselectEdges.length) {
    await preselectEdgeCollection.import(preselectEdges);
  }

  return handle;
}

// clone all AccommodationPlacements concurrently, set the result to
// newOutputVertices.accommodationPlacements
async function cloneAccommodationPlacements(oldAccommodationPlacements, newOutputVertices) {
  newOutputVertices.accommodationPlacements = await Promise.all(oldAccommodationPlacements.map( // eslint-disable-line no-param-reassign
      oldAccommodationPlacement => cloneAccommodationPlacement(oldAccommodationPlacement)
  ));
}

// Clone accommodationPlacement and output Edges.
// Edge 1: accommodationPlacement --BookIn--> serviceBooking
// Edge 2: accommodationPlacement --use--> supplier
// Edge 3: accommodationPlacement --preselect--> accommodation
async function cloneAccommodationPlacement(oldAccommodationPlacement) {
  const oldServiceBookings = oldAccommodationPlacement.serviceBookings;
  const newServiceBookings = await cloneServiceBookings(oldServiceBookings);
  // the accommodations and suppliers data is live load from real data.
  const oldAccommodationsIds = oldAccommodationPlacement.accommodations;
  const oldSupplierId = oldAccommodationPlacement.supplier; // 1:1 preselect;

  // Clone this transferPlacement document
  cleanDoc(oldAccommodationPlacement, ['serviceBookings', 'accommodations', 'supplier']);
  const newAccommodationPlacement = Object.assign({}, oldAccommodationPlacement);
  const handle = await accommodationPlacementsCollection.save(newAccommodationPlacement);

  // save new accommodationPlacement --BookIn--> serviceBooking edge.
  const bookInEdges = newServiceBookings.map(serviceBooking => ({ _from: handle._id, _to: serviceBooking._id }));
  if (bookInEdges && bookInEdges.length) {
    await bookInEdgeCollection.import(bookInEdges);
  }

  // save accommodationPlacement --use--> supplier edges
  if (oldSupplierId) {
    const useEdges = [{ _from: handle._id, _to: oldSupplierId }];
    await useEdgeCollection.import(useEdges);
  }

  // save accommodationPlacement --preselect--> accommodation edges
  const preselectEdges = oldAccommodationsIds.map(accommodationsId => ({ _from: handle._id, _to: accommodationsId }));
  if (preselectEdges && preselectEdges.length) {
    await preselectEdgeCollection.import(preselectEdges);
  }

  return handle;
}

// clone the all ServiceBooking concurrently, return a new ordered
// ServiceBookings
async function cloneServiceBookings(oldServiceBookings) {
  const newServiceBookings = await Promise.all(oldServiceBookings.map(
     async (oldServiceBooking, idx) => {
       const newServiceBooking = await cloneServiceBooking(oldServiceBooking);
       return { order: idx, newServiceBooking };
     }
  ));

  return newServiceBookings.sort((a, b) => a.order - b.order).map(item => item.newServiceBooking);
}

// Clone serviceBookings document and output Edges.
// Edge 1: ServiceBooking --BookIn--> roomConfigs
// Edge 2: ServiceBooking --use--> accommodations, tours, transfers
async function cloneServiceBooking(oldServiceBooking) {
  const bookInEdgesIds = oldServiceBooking.bookInEdgesIds;
  const useEdgesIds = oldServiceBooking.useEdgesIds;

  // clean the status field of oldServiceBooking and some injected edges fields.
  cleanDoc(oldServiceBooking, ['status', 'bookInEdgesIds', 'useEdgesIds']);
  const newServiceBooking = Object.assign({}, oldServiceBooking, {
    updatedOn: newDate()
  });
  const handle = await serviceBookingsCollection.save(newServiceBooking);

  // save new ServiceBooking --BookIn--> serviceBooking edge.
  const bookInEdges = bookInEdgesIds.map(edgeToId => ({ _from: handle._id, _to: edgeToId }));
  if (bookInEdges && bookInEdges.length) {
    await bookInEdgeCollection.import(bookInEdges);
  }

  // save serviceBooking --use--> accommodations, tours, transfers edges
  const useEdges = useEdgesIds.map(edgeToId => ({ _from: handle._id, _to: edgeToId }));
  await useEdgeCollection.import(useEdges);

  return handle;
}


// clone the all TransferPlacements concurrently, set the result to
// newOutputVertices.transferPlacements
async function cloneTransferPlacements(allCityBookingsInOrder) {
  const oldCityBookingIds = allCityBookingsInOrder.map(cityBookings => cityBookings.oldCityBookingId);
  const cityBookingIdMaps = {}; //  cityBookingIdMaps[oldCityBookingId] = newCityBookingId
  allCityBookingsInOrder.map((cityBookings) => { cityBookingIdMaps[cityBookings.oldCityBookingId] = cityBookings._id; return cityBookingIdMaps; });

  const getUniqueTransferPlacementsIdsQuery = `
    let t1 = (for edge in transfer filter edge._from in @cityBookingIds return edge._to)
    let t2 = (for edge in transfer filter edge._to in @cityBookingIds return edge._from)
    RETURN append (t1, t2, true)
  `;
  const result = await db.query(getUniqueTransferPlacementsIdsQuery, {
    cityBookingIds: oldCityBookingIds
  });
  const uniqueTPIds = await result.next();
  await Promise.all(uniqueTPIds.map(
      oldTransferPlacementId => cloneTransferPlacement(oldTransferPlacementId, cityBookingIdMaps)));
}

// Clone transferPlacements document and outputEdges,
// Edge 1: transferPlacements <--transfer--> cityBookings ( 1 or 2 edges)
// Edge 2: transferPlacements --preselect--> transfers
// Edge 3: transferPlacements --BookIn--> serviceBookings
async function cloneTransferPlacement(oldTransferPlacementId, cityBookingIdMaps) {
  const oldTransferPlacement = await queryPlacementsAll(oldTransferPlacementId);
  // clone all the serviceBookings of this TransferPlacements,
  const oldServiceBookings = oldTransferPlacement.serviceBookings;
  const newServiceBookings = await cloneServiceBookings(oldServiceBookings);

  // the transfers data is live load from real data.
  const oldTransferIds = oldTransferPlacement.transfers;
  // fromCityBookingIds, toCityBookingIds are old CityBookingIds transferred
  // from/to this TransferPlacement
  const oldFromCityBookingIds = oldTransferPlacement.fromCityBookingIds;
  const oldToCityBookingIds = oldTransferPlacement.toCityBookingIds;

  // Clone this transferPlacement document
  cleanDoc(oldTransferPlacement, ['fromCityBookingIds', 'toCityBookingIds', 'serviceBookings', 'transfers']);
  const newServiceBookingOrder = newServiceBookings.map(newServiceBooking => newServiceBooking._key);
  const newTransferPlacement = Object.assign({}, oldTransferPlacement, { serviceBookingOrder: newServiceBookingOrder });
  const handle = await transferPlacementsCollection.save(newTransferPlacement);

  // save BookIn edges.
  const bookInEdges = newServiceBookings.map(serviceBooking => ({ _from: handle._id, _to: serviceBooking._id }));
  if (bookInEdges && bookInEdges.length) { await bookInEdgeCollection.import(bookInEdges); }

  // save preselect edges
  const preselectEdges = oldTransferIds.map(transferId => ({ _from: handle._id, _to: transferId }));
  if (preselectEdges && preselectEdges.length) {
    await preselectEdgeCollection.import(preselectEdges);
  }

  // Edge: transferPlacements <--transfer--> cityBookings ( 1 or 2 edges)
  const transferEdges = [];
  oldFromCityBookingIds.map(oldFromCityId => transferEdges.push({ _from: cityBookingIdMaps[oldFromCityId], _to: handle._id }));
  oldToCityBookingIds.map(oldToCityId => transferEdges.push({ _from: handle._id, _to: cityBookingIdMaps[oldToCityId] }));
  if (transferEdges.length > 0) {
    await transferEdgeCollection.import(transferEdges);
  }

  return handle;
}

// Query full placement information,  fromCity, toCity, serviceBookings.
async function queryPlacementsAll(transferPlacementId) {
  // Query Transfer placements.
  const aqlQuery = `
  LET transferPlacement = DOCUMENT(@transferPlacementId)
  LET serviceBookingOrderKeys = NOT_NULL(transferPlacement.serviceBookingOrder) ? transferPlacement.serviceBookingOrder : []
  RETURN MERGE ( transferPlacement, 
    { fromCityBookingIds: ( FOR vertx, edge in INBOUND transferPlacement._id transfer RETURN edge._from ) },
    { toCityBookingIds: ( FOR vertx, edge in OUTBOUND transferPlacement._id transfer RETURN edge._to ) },
    { serviceBookings: (
        FOR serviceBookingKey IN serviceBookingOrderKeys
          LET serviceBookingId = CONCAT('serviceBookings/', serviceBookingKey)
          LET serviceBooking = DOCUMENT(serviceBookingId)
          RETURN MERGE(serviceBooking, 
          { useEdgesIds: (
            LET useEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id use RETURN edge)
            FOR edge IN useEdges
              RETURN edge._to)},
         { bookInEdgesIds: (
            LET bookInEdges = (FOR vertex, edge IN OUTBOUND serviceBooking._id bookIn RETURN edge)
            FOR edge IN bookInEdges
              RETURN edge._to
              )}))
    }, 
    { transfers: (
        LET transferEdges = ( FOR vertx, edge in OUTBOUND transferPlacement._id preselect RETURN edge )
        FOR transferEdge in transferEdges
            return transferEdge._to)
    })`;

  const result = await db.query(aqlQuery, {
    transferPlacementId
  });

  return result.next();
}

// new Date in 'YYYY-MM-DD'
function newDate() {
  const d = new Date();
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return `${year}-${month}-${day}`;
}

// clean document metadata properties and specified properties.
function cleanDoc(doc, propertiesToDel) {
  propertiesToDel = propertiesToDel || []; // eslint-disable-line no-param-reassign
  propertiesToDel.push('_id', '_key', '_rev');
  propertiesToDel.map(prop => delete doc[prop]); // eslint-disable-line no-param-reassign
}

export default cloneTrip;
