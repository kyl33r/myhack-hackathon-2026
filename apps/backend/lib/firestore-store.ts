import type { AbstractStore } from './store'
type FirestoreDB = import('firebase-admin/firestore').Firestore

export class FirestoreStore implements AbstractStore {
  constructor(private readonly db: FirestoreDB) {}

  async saveStartup(id: string, data: Record<string, unknown>) {
    await this.db.collection('startups').doc(id).set(data)
  }
  async getStartup(id: string) {
    const doc = await this.db.collection('startups').doc(id).get()
    return doc.exists ? (doc.data() as Record<string, unknown>) : null
  }
  async getAllStartups() {
    const snap = await this.db.collection('startups').get()
    return snap.docs.map(d => d.data() as Record<string, unknown>)
  }

  async saveLinkage(linkage: Record<string, unknown>) {
    await this.db.collection('linkages').doc(linkage.linkage_id as string).set(linkage)
  }
  async getLinkage(id: string) {
    const doc = await this.db.collection('linkages').doc(id).get()
    return doc.exists ? (doc.data() as Record<string, unknown>) : null
  }
  async getAllLinkages() {
    const snap = await this.db.collection('linkages').get()
    return snap.docs.map(d => d.data() as Record<string, unknown>)
  }
  async updateLinkage(id: string, updates: Record<string, unknown>) {
    const ref = this.db.collection('linkages').doc(id)
    if (!(await ref.get()).exists) return null
    await ref.update(updates as Record<string, unknown>)
    return (await ref.get()).data() as Record<string, unknown>
  }

  async savePartner(id: string, data: Record<string, unknown>) {
    await this.db.collection('partners').doc(id).set(data)
  }
}
