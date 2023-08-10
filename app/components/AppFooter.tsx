import { HStack } from '~/components/ui'

export const AppFooter = () => {
  return (
    <div className="flex justify-center bg-background p-4 text-sm text-foreground">
      <HStack>
        <a
          href="https://github.com/coji/llm-meetup-tokyo"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a
          href="https://discord.com/channels/1083356163074170950"
          target="_blank"
          rel="noreferrer"
        >
          Discord
        </a>
      </HStack>
    </div>
  )
}
