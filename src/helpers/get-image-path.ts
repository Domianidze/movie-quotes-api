import { getApiUrl } from 'helpers'

export default (imagePath: string) => imagePath.replace(`${getApiUrl()}/`, '')
