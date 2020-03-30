var md5 = require("md5");

/**
 * Tools Class
 *
 * ```
 * Tools algorithms used through the project
 * ```
 *
 * ```typescript
 * const instance = new ToolsModule();
 * ```
 */
export class ToolsModule {
  public chunkArray(myArray: Array<any>, chunk_size: number): Array<any> {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  public getChunks = async (data: Array<any>, key: any) => {
    let objectArray: any;
    let tmpdata: Array<any>;
    let chunks = [];

    do {
      objectArray = {};
      tmpdata = [];
      data.forEach((item, i) => {
        let itemKey: any = {};

        itemKey[key.PrimaryKey.name] = item[key.PrimaryKey.name];
        if (key.SortKey) {
          itemKey[key.SortKey.name] = item[key.SortKey.name];
        }

        let hash = md5(JSON.stringify(itemKey));

        if (!objectArray[hash]) {
          objectArray[hash] = item;
        } else {
          tmpdata.push(item);
        }
      });

      let chunk: Array<any> = [];

      Object.keys(objectArray).forEach(item => {
        chunk.push(objectArray[item]);
      });

      chunks.push(chunk);
      data = [...tmpdata];
    } while (data.length > 0);

    // chunks = chunks.map(chunk => chunk.chunk(25));
    let chunks24: Array<any> = [];

    chunks.forEach(chunk => {
      chunks24.push(...this.chunkArray(chunk, 24));
    });
    return chunks24;
  };
}
