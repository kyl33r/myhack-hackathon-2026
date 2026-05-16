import type { AbstractStore } from './store'
import { StubStore } from './stub-store'

let _store: AbstractStore | null = null

export function getStore(): AbstractStore {
  if (_store) return _store

  if (process.env.STUB_DB !== 'false') {
    _store = new StubStore()
    return _store
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const admin = require('firebase-admin') as typeof import('firebase-admin')
  if (!admin.apps.length) admin.initializeApp()
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getFirestore } = require('firebase-admin/firestore') as typeof import('firebase-admin/firestore')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FirestoreStore } = require('./firestore-store') as typeof import('./firestore-store')
  _store = new FirestoreStore(getFirestore())
  return _store
}
