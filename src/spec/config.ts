/** More details */
export interface IKeyAttr {
  name: string;
  type: string;
}

export interface IKey {
  PrimaryKey: IKeyAttr;
  SortKey?: IKeyAttr;
}

export interface IConfigUser {
  IdentityPoolId: string;
  DynamoDBRegion: string;
  Table: string;
  Key: IKey;
}
export interface IConfig {
  IdentityPoolId: string;
  Region: string;
  DynamoDBRegion: string;
  Table: string;
  Key: IKey;
}
