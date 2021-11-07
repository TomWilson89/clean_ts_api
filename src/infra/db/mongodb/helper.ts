import { Collection, MongoClient, ObjectId } from 'mongodb'

interface MapTypes {
  _id: ObjectId
  [key: string]: any
}

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect() {
    await this.client.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map: (data: MapTypes): Omit<MapTypes, '_id'> => {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  }
}
