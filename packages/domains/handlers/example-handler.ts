import { curry } from "ramda";

async function exampleDomain(value: string) {
  return value;
}

export default curry(exampleDomain);