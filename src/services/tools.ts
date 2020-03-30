var md5 = require("md5");

/**
 * Tools Class
 *
 * ```
 * Tools algorithms used through the project
 * ```
 *
 * ```typescript
 * const tools = new ToolsModule();
 * ```
 */
export class ToolsModule {
  /**
   * @param data  Array to split into multiple chunks.
   * @param chunk_size  the chunk size, here we will use 25 .
   */
  public chunkArray(data: Array<any>, chunk_size: number): Array<any> {
    var index = 0;
    var arrayLength = data.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = data.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  /**
   *
   * This function is used to split an array of object into multiple chunks,
   * that doesn't contains double object in a single chunk, this way each group
   * of items to add/update will not contains the same object twice, which will trigger
   * an exception
   *
   *
   * @param data  the array to split.
   * @param key  the key we will use to detect doubles.
   */
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
