import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import type { Dayjs } from 'dayjs'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')

export default dayjs
export { Dayjs }
