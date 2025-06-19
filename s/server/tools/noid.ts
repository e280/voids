
import {Id, Noid} from "../types/types.js"

export function noid<T extends {id: Id}>(obj: T): Noid<T> {
	const obj2: any = {...obj}
	delete obj2.id
	return obj2
}

