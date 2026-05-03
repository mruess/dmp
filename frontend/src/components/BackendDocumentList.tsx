import { useEffect, useState } from 'react';
import { apiDelete, apiGetAll } from '../lib/api';
import type { BackendListItem } from '../lib/api';

interface Props {
  currentId: string | null;
  onLoad: (id: string) => void;
  onClose: () => void;
}

export function BackendDocumentList({ currentId, onLoad, onClose }: Props) {
  const [items, setItems] = useState<BackendListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGetAll()
      .then(setItems)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      await apiDelete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Gespeicherte Dokumente</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Schließen">✕</button>
        </div>

        {loading && <p className="modal__status">Laden…</p>}
        {error && <p className="modal__error">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="modal__status">Keine Dokumente im Backend gespeichert.</p>
        )}

        {items.length > 0 && (
          <table className="doc-table">
            <thead>
              <tr>
                <th>Typ</th>
                <th>Patienten-Nr.</th>
                <th>Quartal</th>
                <th>Behandlungsdatum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className={item.id === currentId ? 'doc-table__row--active' : ''}>
                  <td><span className={`doc-type doc-type--${item.type.toLowerCase()}`}>{item.type}</span></td>
                  <td>{item.pnr || '–'}</td>
                  <td>{item.quartal || '–'}</td>
                  <td>{item.serviceTmr ?? '–'}</td>
                  <td className="doc-table__actions">
                    <button
                      className="btn btn--sm btn--outline-dark"
                      onClick={() => onLoad(item.id)}
                    >
                      Laden
                    </button>
                    <button
                      className="btn btn--sm btn--danger"
                      onClick={() => handleDelete(item.id)}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
