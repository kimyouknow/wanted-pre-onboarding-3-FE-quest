import { faker } from '@faker-js/faker/locale/ko'

export const createRandomUserInfo = () => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  name: faker.name.fullName(),
  image: faker.image.avatar(),
})

export const createRandomUserList = (length: number) => Array.from({ length }, () => createRandomUserInfo())
