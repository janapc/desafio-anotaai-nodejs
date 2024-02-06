import 'dotenv/config'

import { server } from './infra/http'
import { connection } from './infra/database/connection/index'

connection()
  .then(() => {
    server()
  })
  .catch((err) => {
    console.log(err)
  })
