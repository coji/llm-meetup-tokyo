import { createId } from '@paralleldrive/cuid2'
import type { LoaderArgs } from '@remix-run/node'
import { eventStream } from 'remix-utils'
import { requireUser } from '~/services/auth.server'
import { emitter } from '~/services/emitter.server'

export const loader = async ({ request, params }: LoaderArgs) => {
  await requireUser(request)

  return eventStream(request.signal, function setup(send) {
    const handle = (eventId: string) => {
      send({ event: 'event-update', data: createId() })
    }
    emitter.on('event', handle)
    return function clear() {
      emitter.off('event', handle)
    }
  })
}
