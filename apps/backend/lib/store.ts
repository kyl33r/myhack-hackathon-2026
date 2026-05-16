export interface AbstractStore {
  saveStartup(startupId: string, data: Record<string, unknown>): Promise<void>
  getStartup(startupId: string): Promise<Record<string, unknown> | null>
  getAllStartups(): Promise<Record<string, unknown>[]>

  saveLinkage(linkage: Record<string, unknown>): Promise<void>
  getLinkage(linkageId: string): Promise<Record<string, unknown> | null>
  getAllLinkages(): Promise<Record<string, unknown>[]>
  updateLinkage(linkageId: string, updates: Record<string, unknown>): Promise<Record<string, unknown> | null>

  savePartner(partnerId: string, data: Record<string, unknown>): Promise<void>
}
