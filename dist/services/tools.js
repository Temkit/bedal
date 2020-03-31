"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var md5 = require("md5");
var ToolsModule = (function () {
    function ToolsModule() {
        var _this = this;
        this.getChunks = function (data, key) { return __awaiter(_this, void 0, void 0, function () {
            var objectArray, tmpdata, chunks, _loop_1, chunks24;
            var _this = this;
            return __generator(this, function (_a) {
                chunks = [];
                _loop_1 = function () {
                    objectArray = {};
                    tmpdata = [];
                    data.forEach(function (item, i) {
                        var itemKey = {};
                        itemKey[key.PrimaryKey.name] = item[key.PrimaryKey.name];
                        if (key.SortKey) {
                            itemKey[key.SortKey.name] = item[key.SortKey.name];
                        }
                        var hash = md5(JSON.stringify(itemKey));
                        if (!objectArray[hash]) {
                            objectArray[hash] = item;
                        }
                        else {
                            tmpdata.push(item);
                        }
                    });
                    var chunk = [];
                    Object.keys(objectArray).forEach(function (item) {
                        chunk.push(objectArray[item]);
                    });
                    chunks.push(chunk);
                    data = __spread(tmpdata);
                };
                do {
                    _loop_1();
                } while (data.length > 0);
                chunks24 = [];
                chunks.forEach(function (chunk) {
                    chunks24.push.apply(chunks24, __spread(_this.chunkArray(chunk, 24)));
                });
                return [2, chunks24];
            });
        }); };
    }
    ToolsModule.prototype.chunkArray = function (data, chunk_size) {
        var index = 0;
        var arrayLength = data.length;
        var tempArray = [];
        for (index = 0; index < arrayLength; index += chunk_size) {
            var myChunk = data.slice(index, index + chunk_size);
            tempArray.push(myChunk);
        }
        return tempArray;
    };
    return ToolsModule;
}());
exports.ToolsModule = ToolsModule;
