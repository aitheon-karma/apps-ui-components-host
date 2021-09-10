import { parseJSON } from '@/shared/helpers/parseJSON';

export const JSONProp = {
  type: String,
  default: '',
  required: true,
  validator: p => !!parseJSON(p),
}
