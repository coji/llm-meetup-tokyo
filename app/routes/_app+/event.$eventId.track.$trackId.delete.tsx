import type { ActionArgs } from '@remix-run/node'
import { useNavigate } from '@remix-run/react'
import { redirect } from 'remix-typedjson'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spacer,
} from '~/components/ui'
import { deleteDemoTrack } from '~/models'
import { emitter } from '~/services/emitter.server'

export const action = async ({ params }: ActionArgs) => {
  const { eventId, trackId } = zx.parseParams(params, {
    eventId: z.string(),
    trackId: zx.NumAsString,
  })
  await deleteDemoTrack(trackId)
  emitter.emit('event', eventId) // イベント更新をリアルタイム通知
  return redirect(`/event/${eventId}`)
}

export default function TrackNextPresenterPage() {
  const navigate = useNavigate()

  const handleOnClose = () => {
    navigate('..')
  }
  return (
    <Dialog open onOpenChange={handleOnClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a Demo Track</DialogTitle>
        </DialogHeader>
        <div>Demo Track を削除します。よろしいですか？</div>
        <DialogFooter>
          <form method="POST">
            <Button variant="destructive" type="submit">
              削除
            </Button>
          </form>
          <Spacer />
          <Button variant="ghost" onClick={handleOnClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
