import auth from '@src/api/routes/auth'
import { Router } from 'express'

export default () => {
  const router = Router()
  auth(router)
  return router
}
