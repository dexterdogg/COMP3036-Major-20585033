const sessions = new Map(); // In-memory session store

export function createSession(sessionId, data) {
  sessions.set(sessionId, { ...data, createdAt: Date.now() });
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId) {
  sessions.delete(sessionId);
}