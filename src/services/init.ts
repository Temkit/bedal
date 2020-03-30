import { IConfigUser } from "./../spec/config";
let AWS = require("aws-sdk");

export class InitModule {
  private static instance: InitModule;

  private _ConfigPayload_: any = <any>{};
  private dynamodbObject: any;

  private constructor(ConfigPayload: any, dynamodb: any) {
    this._ConfigPayload_ = { ...ConfigPayload };
    this.dynamodbObject = dynamodb;
  }

  public static getInstance(ConfigPayload?: IConfigUser): InitModule {
    let keys = ["IdentityPoolId", "DynamoDBRegion", "Table", "Key"];
    if (!InitModule.instance && ConfigPayload) {
      let isTypeOk = keys.reduce(
        (impl, key) => impl && key in ConfigPayload,
        true
      );

      let Region: string = "";

      if (isTypeOk) {
        Region = ConfigPayload.IdentityPoolId.substr(
          0,
          ConfigPayload.IdentityPoolId.indexOf(":")
        );
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

      let dynamodbObject = new AWS.DynamoDB({
        region: ConfigPayload.DynamoDBRegion
      });

      InitModule.instance = new InitModule(ConfigPayload, dynamodbObject);
    }

    return InitModule.instance;
  }

  get dynamodb() {
    return this.dynamodbObject;
  }

  get config(): any {
    return this._ConfigPayload_;
  }
}
