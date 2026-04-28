// netlify/functions/admin-proxy.js
// Faz o trabalho pesado: busca Cartola/SofaScore e salva no GitHub
// O GITHUB_TOKEN fica seguro como variável de ambiente do Netlify

exports.handler = async (event) => {
  const action = event.queryStringParameters?.action;
  const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER  = 'jlcastropassos-stack';
  const GITHUB_REPO   = 'cartola';
  const GITHUB_BRANCH = 'main';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // ── Helpers ────────────────────────────────────────────────────────

  async function fetchCartola(endpoint) {
    const r = await fetch(`https://api.cartola.globo.com/${endpoint}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://cartola.globo.com/',
        'Origin': 'https://cartola.globo.com',
      },
    });
    if (!r.ok) throw new Error(`Cartola ${endpoint} retornou ${r.status}`);
    return r.json();
  }

  async function fetchSofaScore(round) {
    const r = await fetch(
      `https://api.sofascore.com/api/v1/unique-tournament/325/season/87678/events/round/${round}`,
      { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } }
    );
    if (!r.ok) throw new Error(`SofaScore retornou ${r.status}`);
    const data = await r.json();
    const matches = (data.events || []).map(e => ({
      id:        String(e.id),
      homeId:    String(e.homeTeam.id),
      homeName:  e.homeTeam.name,
      homeSigla: e.homeTeam.nameCode,
      awayId:    String(e.awayTeam.id),
      awayName:  e.awayTeam.name,
      awaySigla: e.awayTeam.nameCode,
      timestamp: e.startTimestamp,
      venue:     e.venue?.name || '',
      status:    e.status?.type || 'notstarted',
    }));
    return { round, matches };
  }

  async function salvarGithub(filename, content) {
    if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN não configurado');

    // Busca SHA do arquivo atual (necessário para update)
    const getUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`;
    const getR = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let sha = undefined;
    if (getR.ok) {
      const existing = await getR.json();
      sha = existing.sha;
    }

    // Salva (cria ou atualiza)
    const body = {
      message: `dados: atualiza ${filename}`,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
    };
    if (sha) body.sha = sha;

    const putR = await fetch(getUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!putR.ok) {
      const err = await putR.text();
      throw new Error(`GitHub PUT falhou: ${putR.status} — ${err}`);
    }
    return putR.json();
  }

  // ── Actions ────────────────────────────────────────────────────────

  try {
    if (action === 'status') {
      const data = await fetchCartola('mercado/status');
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'cartola') {
      const data = await fetchCartola('atletas/mercado');
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'sofa') {
      const round = parseInt(event.queryStringParameters?.round || '14', 10);
      const data = await fetchSofaScore(round);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    if (action === 'save') {
      if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };
      }
      const { filename, content } = JSON.parse(event.body || '{}');
      if (!filename || !content) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'filename e content obrigatórios' }) };
      }
      // Só permite salvar dentro de dados/
      if (!filename.startsWith('dados/')) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: 'Só é permitido salvar em dados/' }) };
      }
      const result = await salvarGithub(filename, content);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, sha: result?.content?.sha }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Action inválida' }) };

  } catch (err) {
    console.error('[admin-proxy]', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
