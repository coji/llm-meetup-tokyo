import { type LoaderArgs } from '@remix-run/node'
import { redirect } from 'remix-typedjson'

export const loader = ({ params }: LoaderArgs) => {
  return redirect('guests')
}
