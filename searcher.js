const Fuse = require('fuse.js')

const options = {
  shouldSort: true,
  threshold: 0.5,
  maxPatternLength: 32,
  includeScore: true,
  keys: ["name"]
}

let wordResults

const returnEmail = (list, result) => list.find(element => element.name === result).email

const fuzzySearch = (emailList, textOutput) => {
  if (!textOutput) return null
  const words = textOutput.split(' ').filter(x => x.length >= 3)
  const searcher = new Fuse(emailList, options)
  
  wordResults = words.map(word => {
    return searcher.search(word)
  })

  const flattened = wordResults.reduce((results, current) => {
    return results.concat(current)
  }, [])

  if (flattened.length < 1) return null

  const matches = flattened.reduce((acc, match) => {
    acc[match.item.name] = acc[match.item.name] || 0
    acc[match.item.name] += match.score
    return acc
  }, [])

  const result = Object.keys(matches).reduce((lowest, current) => {
    return lowest < current ? lowest : current
  })

  return returnEmail(emailList, result)
}

module.exports = fuzzySearch