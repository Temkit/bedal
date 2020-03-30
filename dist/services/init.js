"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var InitModule = (function () {
    function InitModule(ConfigPayload, dynamodb) {
        this._ConfigPayload_ = {};
        this._ConfigPayload_ = __assign({}, ConfigPayload);
        this.dynamodbObject = dynamodb;
    }
    InitModule.getInstance = function (ConfigPayload) {
        var keys = ["IdentityPoolId", "DynamoDBRegion", "Table", "Key"];
        if (!InitModule.instance && ConfigPayload) {
            var isTypeOk = keys.reduce(function (impl, key) { return impl && key in ConfigPayload; }, true);
            var Region = "";
            if (isTypeOk) {
                Region = ConfigPayload.IdentityPoolId.substr(0, ConfigPayload.IdentityPoolId.indexOf(":"));
            }
            AWS.config.update({
                region: Region,
                credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: ConfigPayload.IdentityPoolId
                }),
                apiVersions: {
                    dynamodb: "2012-08-10"
                }
            });
            var dynamodbObject = new AWS.DynamoDB({
                region: ConfigPayload.DynamoDBRegion
            });
            InitModule.instance = new InitModule(ConfigPayload, dynamodbObject);
        }
        return InitModule.instance;
    };
    Object.defineProperty(InitModule.prototype, "dynamodb", {
        get: function () {
            return this.dynamodbObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InitModule.prototype, "config", {
        get: function () {
            return this._ConfigPayload_;
        },
        enumerable: true,
        configurable: true
    });
    return InitModule;
}());
exports.InitModule = InitModule;
