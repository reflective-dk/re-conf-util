"use strict";

var uuidv5 = require('uuid/v5');

module.exports = idgen;

/* Generates a stable id from a base id for a specific system and a specific
 * tenant
 */
function idgen(baseId, typeId, tenantId) {
    if (!baseId) {
        throw new Error('base id not found');
    }
    return uuidv5(typeId + baseId, tenantId);
}
