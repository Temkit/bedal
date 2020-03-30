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
Object.defineProperty(exports, "__esModule", { value: true });
var init_1 = require("./../services/init");
var tools_1 = require("./../services/tools");
var SyncModule = (function () {
    function SyncModule() {
        var _this = this;
        this.sync = function (output, types, callback) { return __awaiter(_this, void 0, void 0, function () {
            var chunks, i, length_1, transaction, e_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4, this.tools.getChunks(output, init_1.InitModule.getInstance().config.Key)];
                    case 1:
                        chunks = _a.sent();
                        i = chunks.length;
                        length_1 = chunks.length;
                        _a.label = 2;
                    case 2:
                        if (!i--) return [3, 8];
                        if (!(chunks[i].length > 0)) return [3, 7];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4, this.transactionFactory(chunks[i], types)];
                    case 4:
                        transaction = _a.sent();
                        return [4, this.runTransaction(transaction, callback)];
                    case 5:
                        _a.sent();
                        callback({
                            progress: ((length_1 - i) * 100) / length_1
                        });
                        chunks.splice(i, 1);
                        return [3, 7];
                    case 6:
                        e_1 = _a.sent();
                        callback({ error: e_1 });
                        return [3, 7];
                    case 7: return [3, 2];
                    case 8: return [3, 10];
                    case 9:
                        e_2 = _a.sent();
                        callback({ error: e_2 });
                        return [3, 10];
                    case 10: return [2];
                }
            });
        }); };
        this.runTransaction = function (params, callback) {
            var transactionRequest = init_1.InitModule.getInstance().dynamodb.transactWriteItems(params);
            var cancellationReasons;
            transactionRequest.on("extractError", function (response) {
                try {
                    cancellationReasons = JSON.parse(response.httpResponse.body.toString())
                        .CancellationReasons;
                }
                catch (err) {
                    callback({
                        error: { message: "Error extracting cancellation error", err: err }
                    });
                }
            });
            return new Promise(function (resolve, reject) {
                transactionRequest.send(function (err, response) {
                    if (err) {
                        callback({
                            error: {
                                message: "Error performing transactWrite",
                                cancellationReasons: cancellationReasons,
                                err: err
                            }
                        });
                        return reject(err);
                    }
                    return resolve(response);
                });
            });
        };
        this.transactionFactory = function (output, types) { return __awaiter(_this, void 0, void 0, function () {
            var tmp;
            return __generator(this, function (_a) {
                tmp = [];
                output.forEach(function (item) {
                    var UpdateExpression = "SET ";
                    var ExpressionAttributeNames = {};
                    var ExpressionAttributeValues = {};
                    Object.keys(item).map(function (key) {
                        if (key.includes(init_1.InitModule.getInstance().config.Key.PrimaryKey.name) ||
                            key.includes(init_1.InitModule.getInstance().config.Key.SortKey.name)) {
                        }
                        else if (types[key]) {
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            var ExpressionAttributeValuesAttributeType = {};
                            ExpressionAttributeValuesAttributeType[types[key]] = item[key] + "";
                            ExpressionAttributeValues[":" + key] = ExpressionAttributeValuesAttributeType;
                        }
                        else if (key.includes("date")) {
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            ExpressionAttributeValues[":" + key] = {
                                N: new Date(item[key]).getTime() + ""
                            };
                        }
                        else if (typeof item[key] == "string") {
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            ExpressionAttributeValues[":" + key] = {
                                S: item[key] + ""
                            };
                        }
                        else if (typeof item[key] == "number") {
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            ExpressionAttributeValues[":" + key] = {
                                N: item[key] + ""
                            };
                        }
                        else if (typeof item[key] == "object" && Array.isArray(item[key])) {
                            var tmpArray_1 = [];
                            item[key].map(function (Arel) {
                                tmpArray_1.push({
                                    S: Arel + ""
                                });
                            });
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            ExpressionAttributeValues[":" + key] = {
                                L: tmpArray_1
                            };
                        }
                        else {
                            UpdateExpression = UpdateExpression + ("#" + key + " = :" + key + ", ");
                            ExpressionAttributeNames["#" + key] = key;
                            ExpressionAttributeValues[":" + key] = {
                                S: item[key] + ""
                            };
                        }
                    });
                    UpdateExpression = UpdateExpression.substring(0, UpdateExpression.length - 2);
                    var key = {};
                    var typedPrimarykey = {};
                    var typedSortKey = {};
                    typedPrimarykey[init_1.InitModule.getInstance().config.Key.PrimaryKey.type] =
                        item[init_1.InitModule.getInstance().config.Key.PrimaryKey.name];
                    typedSortKey[init_1.InitModule.getInstance().config.Key.SortKey.type] =
                        item[init_1.InitModule.getInstance().config.Key.SortKey.name];
                    key[init_1.InitModule.getInstance().config.Key.PrimaryKey.name] = typedPrimarykey;
                    key[init_1.InitModule.getInstance().config.Key.SortKey.name] = typedSortKey;
                    var itemUpdate = {
                        Update: {
                            Key: key,
                            TableName: init_1.InitModule.getInstance().config.Table,
                            UpdateExpression: UpdateExpression,
                            ExpressionAttributeNames: ExpressionAttributeNames,
                            ExpressionAttributeValues: ExpressionAttributeValues
                        }
                    };
                    tmp.push(itemUpdate);
                });
                return [2, { TransactItems: tmp }];
            });
        }); };
        this.tools = new tools_1.ToolsModule();
    }
    return SyncModule;
}());
exports.SyncModule = SyncModule;
