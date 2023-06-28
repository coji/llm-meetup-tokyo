import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Button } from '@chakra-ui/react'

export const AppExternalLinkButton = ({ url }: { url: string }) => {
  return (
    <Box>
      <Button
        rightIcon={<ExternalLinkIcon />}
        as="a"
        href={url}
        target="_blank"
        w="auto"
        size="sm"
        _hover={{ bg: 'gray.600', color: 'white' }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        Luma
      </Button>
    </Box>
  )
}
