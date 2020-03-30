import { InitModule } from "./../services/init";
import { ToolsModule } from "./../services/tools";

export class SyncModule {
  tools: any;

  constructor() {
    this.tools = new ToolsModule();
  }

  public sync = async (
    output: Array<any>,
    types: { [key: string]: string },
    callback: Function
  ) => {
    try {
      const chunks = await this.tools.getChunks(
        output,
        InitModule.getInstance().config.Key
      );

      let i = chunks.length;
      const length = chunks.length;

      while (i--) {
        if (chunks[i].length > 0) {
          try {
            let transaction = await this.transactionFactory(chunks[i], types);

            await this.runTransaction(transaction, callback);

            callback({
              progress: ((length - i) * 100) / length
            });

            chunks.splice(i, 1);
          } catch (e) {
            callback({ error: e });
          }
        }
      }
    } catch (e) {
      callback({ error: e });
    }
  };

  private runTransaction = (params: any, callback: Function) => {
    const transactionRequest = InitModule.getInstance().dynamodb.transactWriteItems(
      params
    );

    let cancellationReasons: any;
    transactionRequest.on("extractError", (response: any) => {
      try {
        cancellationReasons = JSON.parse(response.httpResponse.body.toString())
          .CancellationReasons;
      } catch (err) {
        callback({
          error: { message: "Error extracting cancellation error", err }
        });
      }
    });
    return new Promise((resolve, reject) => {
      transactionRequest.send((err: any, response: any) => {
        if (err) {
          callback({
            error: {
              message: "Error performing transactWrite",
              cancellationReasons,
              err
            }
          });
          return reject(err);
        }
        return resolve(response);
      });
    });
  };

  public transactionFactory = async (
    output: Array<any>,
    types: { [key: string]: string }
  ) => {
    let tmp: Array<any> = [];
    output.forEach(item => {
      let UpdateExpression = "SET ";
      let ExpressionAttributeNames: { [key: string]: string } = {};
      let ExpressionAttributeValues: { [key: string]: any } = {};

      Object.keys(item).map(key => {
        if (
          key.includes(InitModule.getInstance().config.Key.PrimaryKey.name) ||
          key.includes(InitModule.getInstance().config.Key.SortKey!.name)
        ) {
        } else if (types[key]) {
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          let ExpressionAttributeValuesAttributeType: {
            [key: string]: string;
          } = {};
          ExpressionAttributeValuesAttributeType[types[key]] = item[key] + "";
          ExpressionAttributeValues[
            ":" + key
          ] = ExpressionAttributeValuesAttributeType;
        } else if (key.includes("date")) {
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          ExpressionAttributeValues[":" + key] = {
            N: new Date(item[key]).getTime() + ""
          };
        } else if (typeof item[key] == "string") {
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          ExpressionAttributeValues[":" + key] = {
            S: item[key] + ""
          };
        } else if (typeof item[key] == "number") {
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          ExpressionAttributeValues[":" + key] = {
            N: item[key] + ""
          };
        } else if (typeof item[key] == "object" && Array.isArray(item[key])) {
          let tmpArray: Array<any> = [];
          item[key].map((Arel: any) => {
            tmpArray.push({
              S: Arel + ""
            });
          });
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          ExpressionAttributeValues[":" + key] = {
            L: tmpArray
          };
        } else {
          UpdateExpression = UpdateExpression + `#${key} = :${key}, `;
          ExpressionAttributeNames["#" + key] = key;
          ExpressionAttributeValues[":" + key] = {
            S: item[key] + ""
          };
        }
      });

      UpdateExpression = UpdateExpression.substring(
        0,
        UpdateExpression.length - 2
      );

      let key: any = {};
      let typedPrimarykey: any = {};
      let typedSortKey: any = {};

      typedPrimarykey[InitModule.getInstance().config.Key.PrimaryKey.type] =
        item[InitModule.getInstance().config.Key.PrimaryKey.name];

      typedSortKey[InitModule.getInstance().config.Key.SortKey!.type] =
        item[InitModule.getInstance().config.Key.SortKey!.name];

      key[
        InitModule.getInstance().config.Key.PrimaryKey.name
      ] = typedPrimarykey;

      key[InitModule.getInstance().config.Key.SortKey!.name] = typedSortKey;

      let itemUpdate = {
        Update: {
          Key: key,
          TableName: InitModule.getInstance().config.Table,
          UpdateExpression: UpdateExpression,
          ExpressionAttributeNames: ExpressionAttributeNames,
          ExpressionAttributeValues: ExpressionAttributeValues
        }
      };

      tmp.push(itemUpdate);
    });

    return { TransactItems: tmp };
  };
}
