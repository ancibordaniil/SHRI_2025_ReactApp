import { bootstrap } from "./cmd/bootstrap.js";
import { serve } from "./cmd/serve.js";

bootstrap().then(serve);
