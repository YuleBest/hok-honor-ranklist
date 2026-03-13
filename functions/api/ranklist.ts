interface Env {
  TOKEN: string
  USER_ID: string
  ROLEID: string
}

interface RequestBody {
  areaId: string | number
  adcode: string | number
  heroId: string | number
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  try {
    const body = (await request.json()) as RequestBody
    const { areaId, adcode, heroId } = body

    if (!areaId || !adcode || !heroId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiBody = {
      recommendPrivacy: '0',
      areaId: String(areaId),
      adcode: String(adcode),
      roleId: env.ROLEID,
      heroId: String(heroId),
    }

    const response = await fetch('https://kohcamp.qq.com/honor/ranklist', {
      method: 'POST',
      headers: {
        token: env.TOKEN,
        userId: env.USER_ID,
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 14; PLR110 Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/121.0.6167.178 Mobile Safari/537.36',
        'Content-Type': 'application/json',
        Accept: '*/*',
        Host: 'kohcamp.qq.com',
        Connection: 'keep-alive',
      },
      body: JSON.stringify(apiBody),
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}
