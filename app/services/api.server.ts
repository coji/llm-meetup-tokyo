export const fetchEmbedding = async (text: string) => {
  const ret = await fetch(`${process.env.API_BASE_URL}/embedding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sentence: text }),
  })
  return (await ret.json()) as { embedding: number[] }
}
