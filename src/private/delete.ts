import { InitModule } from "./../services/init";
import { ToolsModule } from "../services/tools";

export class DeleteModule {
  batchDeleteParams: any = {};

  tools: any;

  constructor() {
    this.tools = new ToolsModule();
  }

  public deleteAll = async (key: any, callback: Function) => {
    try {
      let table: any = {};
      let chunks: Array<any> = [];

      table[InitModule.getInstance().config.Table] = [];
      this.batchDeleteParams["RequestItems"] = table;

      let dataToDeleteParams = this.queryFactory(key);

      let data: any = await this.getDataToDelete(dataToDeleteParams);

      chunks = this.tools.chunkArray(data.Items, 24);

      chunks = chunks.map((chunk: any) => {
        chunk = chunk.map((item: any) => {
          let key = <any>{};
          key[InitModule.getInstance().config.Key.PrimaryKey.name] =
            item[InitModule.getInstance().config.Key.PrimaryKey.name];

          if (
            InitModule.getInstance().config.Key.SortKey &&
            item.hasOwnProperty(
              InitModule.getInstance().config.Key.SortKey!.name
            )
          ) {
            key[InitModule.getInstance().config.Key.SortKey!.name] =
              item[InitModule.getInstance().config.Key.SortKey!.name];
          }

          item = {
            DeleteRequest: {
              Key: key
            }
          };

          return item;
        });

        this.batchDeleteParams.RequestItems[
          InitModule.getInstance().config.Table
        ] = chunk;

        InitModule.getInstance().dynamodb.batchWriteItem(
          this.batchDeleteParams,
          function(err: any, data: any) {
            if (err) {
              callback({ error: err });
            } else {
              callback({ data: data });
            }
          }
        );
      });
    } catch (e) {
      callback({ error: e });
    }
  };

  private getDataToDelete = (params: any) => {
    let query = new Promise((resolve, reject) => {
      InitModule.getInstance().dynamodb.query(
        params,
        (error: any, data: any) => {
          if (error) reject(error);
          resolve(data);
        }
      );
    });

    return query;
  };

  private queryFactory = (key: any) => {
    let typedPrimarykey: any = {};
    let typedSortKey: any = {};

    typedPrimarykey[InitModule.getInstance().config.Key.PrimaryKey.type] =
      key[InitModule.getInstance().config.Key.PrimaryKey.name];

    let KeyConditionExpression =
      "#" +
      InitModule.getInstance().config.Key.PrimaryKey.name +
      " = :" +
      InitModule.getInstance().config.Key.PrimaryKey.name;

    let ExpressionAttributeNames: any = {};
    ExpressionAttributeNames[
      "#" + InitModule.getInstance().config.Key.PrimaryKey.name
    ] = InitModule.getInstance().config.Key.PrimaryKey.name;

    let ExpressionAttributeValues: any = {};
    let TypedExpressionAttributeValues: any = {};
    TypedExpressionAttributeValues[
      InitModule.getInstance().config.Key.PrimaryKey.type
    ] = key[InitModule.getInstance().config.Key.PrimaryKey.name];

    ExpressionAttributeValues[
      ":" + InitModule.getInstance().config.Key.PrimaryKey.name
    ] = TypedExpressionAttributeValues;

    if (
      InitModule.getInstance().config.Key.SortKey &&
      key.hasOwnProperty(InitModule.getInstance().config.Key.SortKey!.name)
    ) {
      typedSortKey[InitModule.getInstance().config.Key.SortKey!.type] =
        key[InitModule.getInstance().config.Key.SortKey!.name];

      KeyConditionExpression =
        KeyConditionExpression +
        " AND #" +
        InitModule.getInstance().config.Key.SortKey!.name +
        " = :" +
        InitModule.getInstance().config.Key.SortKey!.name;

      ExpressionAttributeNames[
        "#" + InitModule.getInstance().config.Key.SortKey!.name
      ] = InitModule.getInstance().config.Key.SortKey!.name;

      let TypedExpressionAttributeValues: any = {};
      TypedExpressionAttributeValues[
        InitModule.getInstance().config.Key.SortKey!.type
      ] = key[InitModule.getInstance().config.Key.SortKey!.name];

      ExpressionAttributeValues[
        ":" + InitModule.getInstance().config.Key.SortKey!.name
      ] = TypedExpressionAttributeValues;
    }

    return {
      TableName: InitModule.getInstance().config.Table,
      KeyConditionExpression: KeyConditionExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues
    };
  };
}
