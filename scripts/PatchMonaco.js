import path from 'path';
import fs from 'fs';


function define(id, obj) {
    return obj;
}

var monacoEditorPath = path.resolve(__dirname, "../node_modules/monaco-editor");
var meta = JSON.parse(fs.readFileSync(path.join(monacoEditorPath, "dev/nls.metadata.json")));
var content = fs.readFileSync(path.join(monacoEditorPath, "dev/vs/editor/editor.main.nls.zh-cn.js"), "utf8");
var zh = eval(content);

var result = {};
Object.keys(meta.keys).forEach(name => {
    var keys = meta.keys[name];
    var originMessages = meta.messages[name];
    var messages = zh[name] || originMessages;
    keys.forEach((key, index) => {
        key = key.key || key;
        !result[key] && (result[key] = messages[index] || originMessages[index]);
    });
});
fs.writeFileSync(path.join(monacoEditorPath, "esm/vs/messages.zh-cn.json"), JSON.stringify(result, null, 4));

var nls = `/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import zh from './messages.zh-cn.json';

function _format(message, args) {
   var result;
   if (args.length === 0) {
       result = message;
   }
   else {
       result = message.replace(/\{(\d+)\}/g, function (match, rest) {
           var index = rest[0];
           return typeof args[index] !== 'undefined' ? args[index] : match;
       });
   }
   return result;
}

function _localize(data, message) {
   var key = data.key || data;
   return zh[key] || message;
}

export function localize(data, message) {
   var args = [];
   for (var _i = 2; _i < arguments.length; _i++) {
       args[_i - 2] = arguments[_i];
   }
   return _format(_localize(data, message), args);
}
`;

fs.writeFileSync(path.join(monacoEditorPath, "esm/vs/nls.js"), nls);