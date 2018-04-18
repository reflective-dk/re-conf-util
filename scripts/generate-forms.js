#!/usr/bin/env node

"use strict";

var path = require('path');
var formGenerator = require(path.join(__dirname, '../lib/form-generator'));

var formLoc = 'forms';
var dataLoc = 'data';

formGenerator.generateForms(formLoc, dataLoc);