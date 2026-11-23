interface AssetBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetBinding;
}

export interface ByteRange {
  start: number;
  end: number;
}

export function parseRangeHeader(header: string, size: number): ByteRange | null {
  if (!header.startsWith('bytes=') || header.includes(',') || size <= 0) return null;
  const [startText, endText] = header.slice(6).split('-', 2);

  if (startText === '') {
    const suffixLength = Number(endText);
    if (!Number.isInteger(suffixLength) || suffixLength <= 0) return null;
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(startText);
  const requestedEnd = endText === '' ? size - 1 : Number(endText);
  if (!Number.isInteger(start) || !Number.isInteger(requestedEnd) || start < 0 || start >= size || requestedEnd < start) {
    return null;
  }
  return { start, end: Math.min(requestedEnd, size - 1) };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const rangeHeader = request.headers.get('Range');
    if (!rangeHeader) return env.ASSETS.fetch(request);

    const assetHeaders = new Headers(request.headers);
    assetHeaders.delete('Range');
    const assetRequest = new Request(request, { headers: assetHeaders });
    const assetResponse = await env.ASSETS.fetch(assetRequest);
    if (!assetResponse.ok) return assetResponse;

    const body = await assetResponse.arrayBuffer();
    const range = parseRangeHeader(rangeHeader, body.byteLength);
    const headers = new Headers(assetResponse.headers);
    headers.set('Accept-Ranges', 'bytes');

    if (!range) {
      headers.set('Content-Range', `bytes */${body.byteLength}`);
      headers.set('Content-Length', '0');
      return new Response(null, { status: 416, headers });
    }

    const partial = body.slice(range.start, range.end + 1);
    headers.delete('Content-Encoding');
    headers.set('Content-Range', `bytes ${range.start}-${range.end}/${body.byteLength}`);
    headers.set('Content-Length', String(partial.byteLength));
    return new Response(request.method === 'HEAD' ? null : partial, { status: 206, headers });
  },
};
