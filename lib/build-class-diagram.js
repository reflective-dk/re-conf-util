"use strict";

module.exports = buildClassDiagram;

var header = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    + '<link rel="stylesheet" href="mermaid.min.css"></head><body>';
var footer = '<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>'
    + '<script>mermaid.initialize({ startOnLoad: true });</script></body></html>';

function buildClassDiagram(conf) {
    return conf.resolve().then(cnf => {
        var views = [].concat.apply([], Object.keys(cnf.classViews).map(k => cnf.classViews[k]));
        var lines = [];
        lines.push('<div class="mermaid">');
        lines.push('classDiagram');
        views.forEach(v => pushLinesForView(v, lines));
        lines.push('</div>');
        return header + '\n' + lines.join('\n') + '\n' + footer;
    });
}

function pushLinesForView(view, lines) {
    var name = view.snapshot.name;
    var attributes = view.snapshot.attributes || {};
    var single = view.snapshot.single || {};
    var multi = view.snapshot.multi || {};
    var labelsets = {};
    if (view.snapshot.extends) {
        lines.push(view.snapshot.extends.name + ' <|-- ' + name);
    }
    Object.keys(single).forEach(k => {
        var targetName = single[k].name;
        (labelsets[targetName] = labelsets[targetName] || []).push(k);
    });
    Object.keys(multi).forEach(k => {
        var targetName = multi[k].name;
        (labelsets[targetName] = labelsets[targetName] || []).push(k);
    });
    Object.keys(labelsets).forEach(targetName => {
        lines.push(targetName + ' <-- ' + name + label(targetName, labelsets[targetName]));
    });
    Object.keys(attributes).forEach(k => {
        lines.push(name + ' : ' + attributes[k].replace(/json/, 'string') + ' ' + k);
    });
}

function label(targetName, labels) {
    var tn = targetName.replace(/ /g, '').toLowerCase();
    var label = labels.join(', ');
    return tn === label.toLowerCase() ? '' : ' : ' + label;
}
