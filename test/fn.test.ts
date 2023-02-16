import { Elysia } from '../src'
import { describe, expect, it } from 'bun:test'

import SuperJSON from 'superjson'

const app = new Elysia()
	.state('version', 1)
	.decorate('getVersion', () => 1)
	.decorate('mirrorDecorator', <T>(v: T) => v)
	.expose(({ getVersion, mirrorDecorator, store: { version } }) => ({
		ping: () => 'pong',
		mirror: (value: any) => value,
		version: () => version,
		getVersion,
		mirrorDecorator,
		nested: {
			data() {
				return 'a'
			}
		}
	}))
	.expose(({ permission }) => ({
		authorized: permission({
			value: () => 'authorized',
			allow({ request: { headers } }) {
				if (!headers.has('Authorization'))
					throw new Error('Authorization is required')
			}
		}),
		prisma: permission({
			value: {
				user: {
					create<T extends string>(name: T) {
						return name
					},
					delete<T extends string>(name: T) {
						return name
					}
				}
			},
			allow({ key, params }) {
				if (key === 'user.delete' && params === 'Arona')
					throw new Error('Forbidden')
			}
		})
	}))
	.listen(8080)

const fn = (
	body: Array<{ n: string[] } | { n: string[]; p: any }>,
	headers: HeadersInit = {}
): Promise<unknown[]> =>
	app
		.handle(
			new Request('http://localhost/~fn', {
				method: 'POST',
				headers: {
					'content-type': 'elysia/fn',
					...headers
				},
				body: SuperJSON.stringify(body)
			})
		)
		.then((x) => x.text())
		.then((x) => SuperJSON.parse(x))

describe('Elysia Fn', () => {
	it('handle non-parameter', async () => {
		const res = await fn([{ n: ['ping'] }])

		expect(res[0]).toEqual('pong')
	})

	it('handle parameter', async () => {
		const res = await fn([{ n: ['mirror'], p: 1 }])

		expect(res[0]).toEqual(1)
	})

	it('extends SuperJSON parameter', async () => {
		const res = await fn([{ n: ['mirror'], p: new Set([1, 2, 3]) }])

		expect(res[0]).toEqual(new Set([1, 2, 3]))
	})

	it('multiple parameters', async () => {
		const res = await fn([
			{ n: ['ping'] },
			{ n: ['mirror'], p: new Error('Hi') }
		])

		expect(res).toEqual(['pong', new Error('Hi')])
	})

	it('preserved order', async () => {
		const arr = new Array(1000).fill(null).map((x, i) => i)
		const res = await fn(arr.map((p) => ({ n: ['mirror'], p })))

		expect(res).toEqual(arr)
	})

	it('handle nested producer', async () => {
		const res = await fn([{ n: ['nested', 'data'] }])

		expect(res[0]).toEqual('a')
	})

	it('handle error separately', async () => {
		const date = new Date()

		const res = await fn([
			{ n: ['nested', 'data'] },
			{
				n: ['invalid']
			},
			{ n: ['mirror'], p: date }
		])

		expect(res).toEqual(['a', new Error('Invalid procedure'), date])
	})

	it('handle request permission', async () => {
		const res = await fn([{ n: ['authorized'] }], {
			Authorization: 'Ar1s'
		})

		expect(res[0]).toEqual('authorized')
	})

	it('handle request parameters', async () => {
		const res = await fn([
			{ n: ['prisma', 'user', 'delete'], p: 'Yuuka' },
			{ n: ['prisma', 'user', 'create'], p: 'Noa' },
			{ n: ['prisma', 'user', 'delete'], p: 'Arona' }
		])

		expect(res).toEqual(['Yuuka', 'Noa', new Error('Forbidden')])
	})

	it('inherits state and decorators', async () => {
		const res = await fn([
			{ n: ['getVersion'] },
			{ n: ['version'] },
			{
				n: ['mirrorDecorator'],
				p: 1
			}
		])

		expect(res).toEqual([1, 1, 1])
	})
})

// [
// { n: ['prisma', 'users', 'create'], p: 'a' },
// { n: ['prisma', 'users', 'delete'], p: 'a' }
// { n: ['mirror'], p: 29301 },
// { n: ['mirror'], p: 1 },
// { n: ['decorator'], p: '' },
// { n: ['store'] },
// { n: ['nested', 'data'] },
// ]