import { setTimeout } from 'timers/promises'
const delay = async (ms: number) => await setTimeout(ms)

const fetchWithRetry = async (text: string, retryCount = 5) => {
  for (let i = 0; i < retryCount; i++) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
          'OpenAI-Organization': process.env.OPENAI_ORGANIZATION_ID ?? '',
        },
        method: 'POST',
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002',
        }),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      const result = (await res.json()) as {
        data: [{ embedding: number[] }]
        usage: { prompt_tokens: number; total_tokens: number }
      }

      return {
        embedding: result.data[0].embedding,
        usage: result.usage.total_tokens,
      }
    } catch (error) {
      if (i === retryCount - 1) throw error
      await delay((i + 1) ** 2 * 1000)
    }
  }
}

export const fetchEmbedding = async (text: string) => {
  return fetchWithRetry(text)
}
