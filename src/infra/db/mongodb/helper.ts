import { Collection, MongoClient, ObjectId } from 'mongodb'

interface MapTypes {
  _id: ObjectId
  [key: string]: any
}

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect() {
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (data: MapTypes): Omit<MapTypes, '_id'> => {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  }
}
