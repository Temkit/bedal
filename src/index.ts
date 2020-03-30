import { DeleteModule } from "./private/delete";
import { InitModule } from "./services/init";
import { SyncModule } from "./private/sync";

let init = InitModule.getInstance;
let sync = new SyncModule().sync;
let deleteAll = new DeleteModule().deleteAll;

export { init, sync, deleteAll };
