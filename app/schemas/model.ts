import { z } from 'zod'

export const demoTrackSchema = z.object({
  title: z.string().nonempty('必須').max(100, '最大100文字'),
  hostId: z.string().nonempty('必須'),
  zoomUrl: z.string().optional(),
  state: z.enum(['In Preparation', 'On Live', 'Finished']),
})
