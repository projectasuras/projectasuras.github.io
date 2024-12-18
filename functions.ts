import { Options } from "./quartz/components/ExplorerNode"
export const mapFn: Options["mapFn"] = (node) => {
  // implement your function here
}
export const filterFn: Options["filterFn"] = (node) => {
  // implement your function here
  return false
}
export const sortFn: Options["sortFn"] = (a, b) => {
    if ((!a.file && !b.file) || (a.file && b.file)) {
        // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
        // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"

        let nameA = ""
        let nameB = ""

        
        if (a.name !== "" && a.name !== a.displayName) {
            nameA = a.name;
        } else {
            nameA = a.displayName;
        }

        if (b.name !== "" && b.name !== b.displayName) {
            nameB = b.name;
        } else {
            nameB = b.displayName;
        }

        return nameA.localeCompare(nameB, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      }
      if (a.file && !b.file) {
        return 1
      } else {
        return -1
      }
}