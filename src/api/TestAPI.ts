import { CancelToken } from "axios"

export const Test = async (cancelToken: CancelToken) => {
    s.get(`/Test`), { cancelToken }
}
