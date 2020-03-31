import { DeleteModule } from "./private/delete";
import { InitModule } from "./services/init";
import { SyncModule } from "./private/sync";

const Bedal = {
  init: InitModule.getInstance,
  sync: new SyncModule().sync,
  delete: new DeleteModule().deleteAll
};

export { Bedal };
