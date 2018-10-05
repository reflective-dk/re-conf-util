"use strict";

module.exports = buildClassDiagram;

var header = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
    + '<link rel="stylesheet" href="mermaid.min.css"></head><body>';
var footer = '<script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>'
    + '<script>mermaid.initialize({startOnLoad:true});</script></body></html>';

function buildClassDiagram(conf) {
    return conf.resolve().then(cnf => {
        return header +
  '<div class="mermaid">\n\
    classDiagram\n\
    Class01 <|-- AveryLongClass : Cool\n\
    Class03 *-- Class04\n\
    Class05 o-- Class06\n\
    Class07 .. Class08\n\
    Class09 --> C2 : Where am i?\n\
    Class09 --* C3\n\
    Class09 --|> Class07\n\
    Class07 : equals()\n\
    Class07 : Object[] elementData\n\
    Class01 : size()\n\
    Class01 : int chimp\n\
    Class01 : int gorilla\n\
    Class08 <--> C2: Cool label\n\
  </div>\n' + footer;
    });
}
