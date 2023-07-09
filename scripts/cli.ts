import { cli, command } from 'cleye'
import { clusterEventGuests } from '~/jobs/cluster-event-guests.server'

cli({
  name: 'llm-meetup-tokyo',
  commands: [
    command(
      {
        name: 'clustering',
        alias: 'cluster',
        parameters: ['<eventId>'],
        help: { description: 'イベントゲストをクラスタリングします' },
      },
      (argv) => void clusterEventGuests(argv._.eventId),
    ),
  ],
})
