import { Entity } from "typeorm";

@Entity({ name: "users_deprecated" })
export class UserDeprecated {
  // placeholder entity so imports that still reference './entities/users' don't break at import time
}
