export class Category {
  id?: string
  title: string
  description: string
  ownerId: string

  constructor(title: string, description: string, ownerId: string) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this._valid()
  }

  _valid(): void {
    const fields = []
    if (!this.description || this.description === '') fields.push('description')
    if (!this.title || this.title === '') fields.push('title')
    if (!this.ownerId || this.ownerId === '') fields.push('ownerId')
    if (fields.length > 0) {
      const msg = `these field are required: ${fields.join(',')}`
      throw new Error(msg)
    }
  }
}
