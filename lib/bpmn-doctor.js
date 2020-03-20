"use strict";

var _ = require('lodash');
var moddle = new (require('bpmn-moddle'))();
var Parser = require('xml2js').Parser;

module.exports = bpmnDoctor;

function bpmnDoctor(xml, objectMap, cb) {
    var parser = new Parser({ explicitRoot: false, mergeAttrs: true, emptyTag: null });
    moddle.fromXML(xml, function(err, definitions) {
        parser.parseString(xml, function(err, rawdef) {
            var bpmnProcess = definitions.rootElements.filter(el => el.$type === 'bpmn:Process')[0];
            if (!bpmnProcess) {
                return cb('invalid process BPMN');
            }
            var report = analyzeProcess(bpmnProcess, _.get(rawdef, [ 'bpmn:process', 0 ]), objectMap);
            return cb(null, report);
        });
    });
}

function analyzeProcess(process, rawProcess, objectMap) {
    var flowNodeRefs = {};
    var register = {
        userTasks: {},
        serviceTasks: {}
    };
    process.flowElements.filter(el => el.$type === 'bpmn:UserTask')
        .forEach(task => analyzeUserTask(task, register));
    process.flowElements.filter(el => el.$type === 'bpmn:ServiceTask')
        .forEach(task => analyzeServiceTask(task, register));
    var lanes = _.get(analyzeLaneSet((process.laneSets || [])[0], objectMap, register), 'lanes', []);
    xmlVisitLanes(rawProcess, function(element, path) {
        _.get(element, 'bpmn:flowNodeRef', []).forEach(function(ref) {
            var paths = flowNodeRefs[ref] = flowNodeRefs[ref] || [];
            paths.push(path);
        });
    });
    return {
        id: process.id,
        name: process.name,
        lanes: lanes,
        userTasks: register.userTasks,
        serviceTasks: register.serviceTasks,
        flowNodeRefs: {
            referencedInSingleLane: Object.keys(flowNodeRefs).filter(k => flowNodeRefs[k].length == 1),
            referencedInMultipleLanes: Object.keys(flowNodeRefs).filter(k => flowNodeRefs[k].length > 1 & !hasPrefixes(flowNodeRefs[k])),
            invalidReferences: Object.keys(flowNodeRefs).filter(k => hasPrefixes(flowNodeRefs[k]))
        }
    };
}

function analyzeUserTask(task, register) {
    register.userTasks[task.id] = task.name;
}

function analyzeServiceTask(task, register) {
    register.serviceTasks[task.id] = task.name;
}

function analyzeLaneSet(laneSet, objectMap, register) {
    if (!laneSet) {
        return null;
    }
    var lanes = (laneSet.lanes || []).map(lane => analyzeLane(lane, objectMap, register));
    // Sort lanes to make the report stable to change
    lanes.sort((l, r) => l.name > r.name);
    return lanes.length ? { lanes: lanes } : null;
}

function analyzeLane(lane, objectMap, register) {
    var childLanes = analyzeLaneSet(lane.childLaneSet, objectMap, register);
    var responsibility = findResponsibility(lane, objectMap);
    var children = _.get(childLanes, 'lanes');
    var la = { name: lane.name };
    responsibility && (la.responsibility = responsibility);
    children && (la.lanes = children);
    return la;
}

function findResponsibility(lane, objectMap) {
    var responsibilityId = _.get(lane, 'extensionElements.values', []).reduce(function(valr, v) {
        return valr || _.get(v, '$children', []).reduce(function(childr, child) {
            return childr || (child.name === 'responsibility' && child.value);
        }, null);
    }, null);
    return  _.get(objectMap[responsibilityId], 'ref');
}

function xmlVisitLanes(element, visitor, path) {
    path = path || '';
    visitor(element, path);
    _.get(element, 'bpmn:laneSet', []).forEach(laneSet => xmlVisitLanes(laneSet, visitor, path + '/' + laneSet.id));
    _.get(element, 'bpmn:childLaneSet', []).forEach(laneSet => xmlVisitLanes(laneSet, visitor, path + '/' + laneSet.id));
    _.get(element, 'bpmn:lane', []).forEach(lane => xmlVisitLanes(lane, visitor, path + '/' + lane.id));
}

function hasPrefixes(list) {
    list = list || [];
    return list.some(left => list.some(right => left != right && right.match('^' + left)));
}
