interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Vimeo MCP.
 */


const BASE = 'https://api.vimeo.com';
const UA = 'pipeworx-mcp-vimeo/1.0 (+https://pipeworx.io)';

const listShape = {
  page: { type: 'number' as const },
  per_page: { type: 'number' as const },
  sort: { type: 'string' as const },
  direction: { type: 'string' as const },
};

const tools: McpToolExport['tools'] = [
  { name: 'video', description: 'Single video.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  {
    name: 'videos_search',
    description: 'Search videos.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, ...listShape, filter: { type: 'string' } }, required: ['query'] },
  },
  { name: 'user', description: 'User profile.', inputSchema: { type: 'object', properties: { user_id: { type: 'string' } }, required: ['user_id'] } },
  { name: 'user_videos', description: 'User videos.', inputSchema: { type: 'object', properties: { user_id: { type: 'string' }, ...listShape }, required: ['user_id'] } },
  { name: 'channel', description: 'Channel.', inputSchema: { type: 'object', properties: { channel_id_or_slug: { type: 'string' } }, required: ['channel_id_or_slug'] } },
  {
    name: 'channel_videos',
    description: 'Channel videos.',
    inputSchema: { type: 'object', properties: { channel_id_or_slug: { type: 'string' }, ...listShape }, required: ['channel_id_or_slug'] },
  },
  { name: 'categories', description: 'List categories.', inputSchema: { type: 'object', properties: {} } },
  { name: 'category', description: 'Single category.', inputSchema: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] } },
  {
    name: 'category_videos',
    description: 'Videos in a category.',
    inputSchema: { type: 'object', properties: { slug: { type: 'string' }, page: { type: 'number' }, per_page: { type: 'number' } }, required: ['slug'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Vimeo requires an API key. Set PLATFORM_VIMEO_KEY or pass ?_apiKey=… (free at https://developer.vimeo.com/apps).');
  const get = async (path: string, params?: URLSearchParams) => {
    const url = `${BASE}${path}${params && [...params].length ? `?${params}` : ''}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.vimeo.*+json;version=3.4', 'User-Agent': UA, Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 401 || res.status === 403) throw new Error('Vimeo: invalid API key/token.');
    if (!res.ok) throw new Error(`Vimeo: ${res.status}`);
    return res.json();
  };
  const buildParams = (keys: string[]) => {
    const p = new URLSearchParams();
    for (const k of keys) if (args[k] != null) p.set(k, String(args[k]));
    return p;
  };
  switch (name) {
    case 'video':
      return get(`/videos/${encodeURIComponent(reqStr(args, 'id', '"76979871"'))}`);
    case 'videos_search': {
      const p = new URLSearchParams({ query: reqStr(args, 'query', '"nature"') });
      for (const k of ['page', 'per_page', 'sort', 'direction', 'filter']) if (args[k] != null) p.set(k, String(args[k]));
      return get('/videos', p);
    }
    case 'user':
      return get(`/users/${encodeURIComponent(reqStr(args, 'user_id', '"staff"'))}`);
    case 'user_videos':
      return get(`/users/${encodeURIComponent(reqStr(args, 'user_id', '"staff"'))}/videos`, buildParams(['page', 'per_page', 'sort', 'direction']));
    case 'channel':
      return get(`/channels/${encodeURIComponent(reqStr(args, 'channel_id_or_slug', '"staffpicks"'))}`);
    case 'channel_videos':
      return get(`/channels/${encodeURIComponent(reqStr(args, 'channel_id_or_slug', '"staffpicks"'))}/videos`, buildParams(['page', 'per_page', 'sort', 'direction']));
    case 'categories':
      return get('/categories');
    case 'category':
      return get(`/categories/${encodeURIComponent(reqStr(args, 'slug', '"animation"'))}`);
    case 'category_videos':
      return get(`/categories/${encodeURIComponent(reqStr(args, 'slug', '"animation"'))}/videos`, buildParams(['page', 'per_page']));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
