/* eslint-disable no-console */
import request, { POST } from '../../../utils/request';
import config from '../../../config/environment';
import { db } from '../../database';

function getAccessibleTransfers(args) {
  return request(`${config.foxx.url}/accessibletransfers`, POST, args);
}

async function getSupplierByTransferId(transferId) {
  try {
    const supplierCollection = db.collection('suppliers');
    const supplyEdgeCollection = db.edgeCollection('supply');
    const transferEdge = await supplyEdgeCollection.firstExample({ _to: transferId });
    return await supplierCollection.firstExample({ _id: transferEdge._from });
  } catch (e) {
    console.log(e.stack);
    return null;
  }
}

export { getAccessibleTransfers, getSupplierByTransferId };
