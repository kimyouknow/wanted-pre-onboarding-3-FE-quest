import auth from '@src/api/routes/user'
import { Router } from 'express'

export default () => {
  const router = Router()
  auth(router)
  return router
}
