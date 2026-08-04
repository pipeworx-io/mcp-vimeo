# @pipeworx/vimeo

[Vimeo API](https://developer.vimeo.com/api/reference) MCP — public video/user/channel/group lookups. Free personal access token required.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Auth

- Platform: `PLATFORM_VIMEO_KEY`. BYO: `?_apiKey=…` (personal access token).

## Tools

- `video(id)` — single video
- `videos_search(query, page?, per_page?, sort?, direction?, filter?)` — search videos
- `user(user_id)` — user profile
- `user_videos(user_id, page?, per_page?, sort?, direction?)` — user videos
- `channel(channel_id_or_slug)` — channel
- `channel_videos(channel_id_or_slug, page?, per_page?, sort?, direction?)` — channel videos
- `categories()` — list categories
- `category(slug)` — single category
- `category_videos(slug, page?, per_page?)` — videos in a category

## Data source

`https://api.vimeo.com`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "vimeo": {
      "url": "https://gateway.pipeworx.io/vimeo/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Vimeo data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
