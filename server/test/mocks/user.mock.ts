import { faker } from '@faker-js/faker/locale/ko'

export const createRandomUserInfo = () => ({
  email: faker.internet.email(),
  nickname: faker.name.fullName(),
})

export const createRandomUserList = (length: number) => Array.from({ length }, () => createRandomUserInfo())
