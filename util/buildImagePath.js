const setConverter = {
  "Classic":"Classic",
  "Basic":"Basic",
  "Curse of Naxxramas":"Naxx",
  "Goblins vs Gnomes":"GVG",
  "Blackrock Mountain":"BRM",
  "The Grand Tournament":"TGT",
  "League of Explorers":"LOE",
}

const buildImagePath = (cardInfo) => {
  return new Promise((resolve, reject) => {
    if (typeof cardInfo === 'undefined' || cardInfo === null)
      resolve(`/images/cards/404.png`);
    else if (typeof cardInfo["Token Type"] === 'undefined')
      resolve(`/images/cards/${cardInfo.Class}/${setConverter[cardInfo["Card Set"]]}/${cardInfo.Name.replaceAll(':','')}.png`);
    else
      resolve(`/images/cards/${cardInfo["Token Type"]}/${cardInfo.Name.replaceAll(':','')}.png`);
  })
}

export {buildImagePath};