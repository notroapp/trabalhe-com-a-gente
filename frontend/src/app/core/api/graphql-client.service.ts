import { Injectable } from '@angular/core';

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

@Injectable({ providedIn: 'root' })
export class GraphqlClientService {
  private readonly endpoint = (globalThis as { __env?: { FRONTEND_GRAPHQL_URL?: string } }).__env
    ?.FRONTEND_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

  async query<TData>(
    query: string,
    variables?: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ): Promise<TData> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      signal: options?.signal
    });

    if (!response.ok) {
      throw new Error('GraphQL request failed.');
    }

    const payload = (await response.json()) as GraphqlResponse<TData>;
    if (payload.errors?.length) {
      throw new Error(payload.errors[0].message);
    }

    if (!payload.data) {
      throw new Error('GraphQL response has no data.');
    }

    return payload.data;
  }
}
