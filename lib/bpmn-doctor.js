"use strict";

var _ = require('lodash');
var moddle = new (require('bpmn-moddle'))();

module.exports = bpmnDoctor;

function bpmnDoctor(xml, objectMap, cb) {
    moddle.fromXML(xml, function(err, definitions) {
        var bpmnProcess = definitions.rootElements.filter(el => el.$type === 'bpmn:Process')[0];
        if (!bpmnProcess) {
            return cb('invalid process BPMN');
        }
        var report = analyzeProcess(bpmnProcess);
        return cb(null, report);
    });
}

function analyzeProcess(process) {
    var register = {
        userTasks: {},
        serviceTasks: {}
    };
    process.flowElements.filter(el => el.$type === 'bpmn:UserTask')
        .forEach(task => analyzeUserTask(task, register));
    process.flowElements.filter(el => el.$type === 'bpmn:ServiceTask')
        .forEach(task => analyzeServiceTask(task, register));
    var lanes = _.get(analyzeLaneSet((process.laneSets || [])[0], register), 'lanes', []);
    return {
        id: process.id,
        name: process.name,
        lanes: lanes,
        userTasks: register.userTasks,
        serviceTasks: register.serviceTasks
    };
}

function analyzeUserTask(task, register) {
    register.userTasks[task.id] = task.name;
}

function analyzeServiceTask(task, register) {
    register.serviceTasks[task.id] = task.name;
}

function analyzeLaneSet(laneSet, register) {
    if (!laneSet) {
        return null;
    }
    var lanes = (laneSet.lanes || []).map(lane => analyzeLane(lane, register));
    // Sort lanes to make the report stable to change
    lanes.sort((l, r) => l.name > r.name);
    return lanes.length ? { lanes: lanes } : null;
}

function analyzeLane(lane, register) {
//    console.log('lane', lane);
    var childLanes = analyzeLaneSet(lane.childLaneSet, register);
    var responsibility = findResponsibility(lane);
    var children = _.get(childLanes, 'lanes');
    var la = { name: lane.name };
    responsibility && (la.responsibility = responsibility);
    children && (la.lanes = children);
    return la;
}

function findResponsibility(lane) {
    var responsibility = _.get(lane, 'extensionElements.values', []).reduce(function(valr, v) {
        return valr || _.get(v, '$children', []).reduce(function(childr, child) {
            return childr || (child.name === 'responsibility' && child.value);
        }, null);
    }, null);
    return responsibility;
}
