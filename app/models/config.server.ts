import { prisma } from '~/services/database.server'

export const upsertConfig = async (key: string, value: string) => {
  return await prisma.config.upsert({
    where: { key },
    create: { key, value },
    update: { key, value },
  })
}

export const getConfigs = async (keys: string[]) => {
  const configs = await prisma.config.findMany({
    where: { key: { in: keys } },
  })

  // { key: value } の形式に変換
  const ret: Record<string, string | undefined> = {}
  for (const key of keys) {
    ret[key] = configs.find((c) => c.key === key)?.value
  }
  return ret
}
