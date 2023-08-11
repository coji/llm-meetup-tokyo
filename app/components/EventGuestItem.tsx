import Linkify from 'linkify-react'
import { Avatar, AvatarImage, Badge, HStack, Stack } from '~/components/ui'

interface EventGuestItemProps {
  name: string
  avatarUrl: string
  sns?: string
  demo?: string
  clusterIndex?: number
}
export const EventGuestItem = ({
  name,
  avatarUrl,
  sns,
  demo,
  clusterIndex,
}: EventGuestItemProps) => {
  return (
    <Stack className="flex-col md:flex-row md:items-start">
      <HStack className="w-auto gap-4 md:w-[16rem]">
        <Avatar>
          <AvatarImage src={avatarUrl} loading="lazy" />
        </Avatar>
        <div>
          <p>{name}</p>

          <p className="break-all text-xs text-slate-500 hover:text-primary">
            <Linkify
              options={{
                defaultProtocol: 'https',
                target: '_blank',
              }}
            >
              {sns}
            </Linkify>
          </p>
        </div>
      </HStack>

      <div className="flex-1 break-all rounded px-2 py-1 text-sm ">
        <Linkify options={{ defaultProtocol: 'https', target: '_blank' }}>
          {demo}
        </Linkify>
      </div>

      {!!clusterIndex && (
        <HStack className="text-xs text-slate-500">
          <p>クラスタ</p> <Badge variant="outline">{clusterIndex}</Badge>
        </HStack>
      )}
    </Stack>
  )
}
