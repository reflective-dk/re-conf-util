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
        views.forEach(v => pushRelationsForView(v, lines));
        lines.push('</div>');
        return header + '\n' + lines.join('\n') + '\n' + footer;
    });
}

function pushRelationsForView(view, lines) {
    var name = view.snapshot.name;
    var attributes = view.snapshot.attributes || {};
    var single = view.snapshot.single || {};
    var multi = view.snapshot.multi || {};
    if (view.snapshot.extends) {
        lines.push(view.snapshot.extends.name + ' <|-- ' + name);
    }
    Object.keys(single).forEach(k => {
        lines.push(single[k].name + ' <-- ' + name + label(single[k].name, k));
    });
    Object.keys(multi).forEach(k => {
        lines.push(multi[k].name + ' <-- ' + name + label(multi[k].name, k));
    });
    Object.keys(attributes).forEach(k => {
        lines.push(name + ' : string ' + k);
    });
}

function label(targetName, relationName) {
    var tn = targetName.replace(/ /g, '').toLowerCase();
    var rn = relationName.toLowerCase();
    return tn === rn ? '' : ' : ' + relationName;
}
