const BASE = '/api/dmp';

export interface BackendListItem {
  id: string;
  pnr: string;
  type: string;
  fall: string;
  serviceTmr: string | null;
  originationDttm: string | null;
  quartal: string;
  lanr: string;
  bsnr: string;
  ik: string;
}

export interface BackendDetail extends BackendListItem {
  xml: string; // base64-encoded
}

async function checkOk(resp: Response): Promise<Response> {
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return resp;
}

export async function apiCreate(payload: object): Promise<string> {
  const resp = await checkOk(await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
  const { id } = await resp.json();
  return id;
}

export async function apiUpdate(id: string, payload: object): Promise<string> {
  const resp = await checkOk(await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }));
  const { id: returnedId } = await resp.json();
  return returnedId;
}

export async function apiGetAll(): Promise<BackendListItem[]> {
  const resp = await checkOk(await fetch(BASE));
  return resp.json();
}

export async function apiGetById(id: string): Promise<BackendDetail> {
  const resp = await checkOk(await fetch(`${BASE}/${id}`));
  return resp.json();
}

export async function apiDelete(id: string): Promise<void> {
  await checkOk(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
}
