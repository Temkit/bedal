"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delete_1 = require("./private/delete");
var init_1 = require("./services/init");
var sync_1 = require("./private/sync");
var Bedal = {
    init: init_1.InitModule.getInstance,
    sync: new sync_1.SyncModule().sync,
    delete: new delete_1.DeleteModule().deleteAll
};
exports.Bedal = Bedal;
