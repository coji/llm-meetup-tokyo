import {
  Avatar,
  Box,
  HStack,
  Tag,
  Text,
  type FlexProps,
} from '@chakra-ui/react'
import Linkify from 'linkify-react'

interface EventGuestItemProps extends FlexProps {
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
    <>
      <HStack w={{ base: 'auto', md: '16rem' }} gap="4">
        <Avatar size="sm" src={avatarUrl}></Avatar>
        <Box>
          <Text>{name}</Text>

          <Text fontSize="xs" color="card.text.thin" wordBreak="break-all">
            <Linkify
              options={{
                defaultProtocol: 'https',
                target: '_blank',
              }}
            >
              {sns}
            </Linkify>
          </Text>
        </Box>
      </HStack>

      <Box
        flex="1"
        fontSize="sm"
        color="card.text.thin"
        p="1"
        wordBreak="break-all"
      >
        <Linkify options={{ defaultProtocol: 'https', target: '_blank' }}>
          {demo}
        </Linkify>
      </Box>

      {clusterIndex !== null && (
        <HStack fontSize="sm">
          <Text>クラスタ</Text> <Tag>{clusterIndex}</Tag>
        </HStack>
      )}
    </>
  )
}
