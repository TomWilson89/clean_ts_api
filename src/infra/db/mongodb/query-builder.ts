export class QueryBuilder {
  private readonly query = []

  private addStep(step: string, data: Record<string, any>): QueryBuilder {
    this.query.push({
      [step]: data
    })

    return this
  }

  public match(data: Record<string, any>): QueryBuilder {
    return this.addStep('$match', data)
  }

  public group(data: Record<string, any>): QueryBuilder {
    return this.addStep('$group', data)
  }

  public project(data: Record<string, any>): QueryBuilder {
    return this.addStep('$project', data)
  }

  public unwind(data: Record<string, any>): QueryBuilder {
    return this.addStep('$unwind', data)
  }

  public lookup(data: Record<string, any>): QueryBuilder {
    return this.addStep('$lookup', data)
  }

  public sort(data: Record<string, any>): QueryBuilder {
    return this.addStep('$sort', data)
  }

  public build(): Array<Record<string, any>> {
    return this.query
  }
}
