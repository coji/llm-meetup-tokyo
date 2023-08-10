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
    <Stack>
      <HStack className="md:w-16rem w-auto gap-4">
        <Avatar>
          <AvatarImage src={avatarUrl} loading="lazy" />
        </Avatar>
        <div>
          <p>{name}</p>

          <p className="break-all text-xs">
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

      <div className="flex-1 break-all p-1 text-sm">
        <Linkify options={{ defaultProtocol: 'https', target: '_blank' }}>
          {demo}
        </Linkify>
      </div>

      {clusterIndex !== null && (
        <HStack className="text-sm">
          <p>クラスタ</p> <Badge variant="outline">{clusterIndex}</Badge>
        </HStack>
      )}
    </Stack>
  )
}
