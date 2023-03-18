import { authController } from '@src/api/controllers'
import authService, { USER_SUCCESS, USER_VALIDATION_ERRORS } from '@src/services/auth.service'
import userService from '@src/services/user.service'
import { createToken } from '@src/utils/authorizeUtils'
import { createError } from '@src/utils/responseUtils'
import { createRandomUserInput } from '@test/mocks/user.mock'
import { NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import httpMock from 'node-mocks-http'

const testBody = createRandomUserInput()

let req = httpMock.createRequest()
let res = httpMock.createResponse()
const next: NextFunction = jest.fn()

describe('Auth Controller : signUp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    req = httpMock.createRequest()
    res = httpMock.createResponse()
    req.body = testBody
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return a EMPTY_FORM, BAD_REQUEST response if one of felid is empty', async () => {
    const errorReturn = {
      isValid: false,
      message: USER_VALIDATION_ERRORS.EMPTY_FORM,
    }
    jest.spyOn(authService, 'loginValidator').mockReturnValue(errorReturn)

    await authController.signUp(req, res, next)

    expect(authService.loginValidator).toHaveBeenCalledWith(testBody)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res._getData()).toStrictEqual(createError(errorReturn.message))
    expect(next).not.toHaveBeenCalled()
  })
  it('should return a INVALID_EMAIL response If the email validate condition is not met', async () => {
    const errorReturn = {
      isValid: false,
      message: USER_VALIDATION_ERRORS.INVALID_EMAIL,
    }
    const inValidInput = { ...testBody, email: 'asdf' }
    req.body = inValidInput
    jest.spyOn(authService, 'loginValidator').mockReturnValue(errorReturn)

    await authController.signUp(req, res, next)

    expect(authService.loginValidator).toHaveBeenCalledWith(inValidInput)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res._getData()).toStrictEqual(createError(errorReturn.message))
    expect(next).not.toHaveBeenCalled()
  })
  it('should return a INVALID_EMAIL response If the password validate condition is not met', async () => {
    const errorReturn = {
      isValid: false,
      message: USER_VALIDATION_ERRORS.INVALID_PASSWORD,
    }
    const inValidInput = { ...testBody, email: 'asdf' }
    req.body = inValidInput
    jest.spyOn(authService, 'loginValidator').mockReturnValue(errorReturn)

    await authController.signUp(req, res, next)

    expect(authService.loginValidator).toHaveBeenCalledWith(inValidInput)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res._getData()).toStrictEqual(createError(errorReturn.message))
    expect(next).not.toHaveBeenCalled()
  })

  it('should return a 409 error if the user already exists', async () => {
    const mockLoginValidator = jest.spyOn(authService, 'loginValidator').mockReturnValue({ isValid: true })
    const mockFindUser = jest.spyOn(userService, 'findUser').mockResolvedValueOnce(true)

    await authController.signUp(req, res, next)

    expect(mockLoginValidator).toHaveBeenCalledWith(testBody)
    expect(mockFindUser).toHaveBeenCalledWith({ email: testBody.email })
    expect(res.statusCode).toBe(StatusCodes.CONFLICT)
    expect(res._getData()).toStrictEqual(createError(USER_VALIDATION_ERRORS.EXIST_USER))
    expect(next).not.toHaveBeenCalled()
  })
  it('should StatusCodes.OK create a new user and return a token', async () => {
    const mockLoginValidator = jest.spyOn(authService, 'loginValidator').mockReturnValue({ isValid: true })
    const mockFindUser = jest.spyOn(userService, 'findUser').mockResolvedValueOnce(false)
    const mockCreateUser = jest.spyOn(userService, 'createUser').mockResolvedValueOnce({ email: testBody.email })

    await authController.signUp(req, res, next)

    expect(mockLoginValidator).toHaveBeenCalledWith(testBody)
    expect(mockFindUser).toHaveBeenCalledWith({ email: testBody.email })
    expect(mockCreateUser).toBeCalledWith({ email: testBody.email, password: testBody.password })
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res._getJSONData()).toStrictEqual({ message: USER_SUCCESS.SIGN_UP, token: createToken(testBody.email) })
  })
  it('should call next with an error if createUser throws an error', async () => {
    const mockLoginValidator = jest.spyOn(authService, 'loginValidator').mockReturnValue({ isValid: true })
    const mockFindUser = jest.spyOn(userService, 'findUser').mockResolvedValueOnce(false)
    const mockCreateUser = jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new Error('Database error'))

    await authController.signUp(req, res, next)

    expect(mockLoginValidator).toHaveBeenCalledWith(testBody)
    expect(mockFindUser).toHaveBeenCalledWith({ email: testBody.email })
    expect(mockCreateUser).toBeCalledWith({ email: testBody.email, password: testBody.password })
    expect(next).toBeCalledWith(new Error('Database error'))
  })
})
