/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000019983")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2862495610",
    "max": 0,
    "min": 0,
    "name": "date",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3852573400",
    "max": 0,
    "min": 0,
    "name": "seasonEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text650617945",
    "max": 0,
    "min": 0,
    "name": "seasonTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1716930793",
    "max": 0,
    "min": 0,
    "name": "color",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2216123988",
    "max": 0,
    "min": 0,
    "name": "feastEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1198612693",
    "max": 0,
    "min": 0,
    "name": "feastTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2155218233",
    "max": 0,
    "min": 0,
    "name": "readingFirstRefEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1125137336",
    "max": 0,
    "min": 0,
    "name": "readingFirstRefTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2141580046",
    "max": 0,
    "min": 0,
    "name": "readingFirstEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3166950799",
    "max": 0,
    "min": 0,
    "name": "readingFirstTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text497374169",
    "max": 0,
    "min": 0,
    "name": "psalmRefEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3737349464",
    "max": 0,
    "min": 0,
    "name": "psalmRefTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1310443792",
    "max": 0,
    "min": 0,
    "name": "psalmEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2373842833",
    "max": 0,
    "min": 0,
    "name": "psalmTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3560404062",
    "max": 0,
    "min": 0,
    "name": "gospelRefEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text391203551",
    "max": 0,
    "min": 0,
    "name": "gospelRefTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3701937933",
    "max": 0,
    "min": 0,
    "name": "gospelEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text532752780",
    "max": 0,
    "min": 0,
    "name": "gospelTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1402861341",
    "max": 0,
    "min": 0,
    "name": "officeRefEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2432420252",
    "max": 0,
    "min": 0,
    "name": "officeRefTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2391493603",
    "max": 0,
    "min": 0,
    "name": "officeEn",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1307407714",
    "max": 0,
    "min": 0,
    "name": "officeTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "help": "",
    "hidden": false,
    "id": "bool887888961",
    "name": "isCustom",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1000019983")

  // remove field
  collection.fields.removeById("text2862495610")

  // remove field
  collection.fields.removeById("text3852573400")

  // remove field
  collection.fields.removeById("text650617945")

  // remove field
  collection.fields.removeById("text1716930793")

  // remove field
  collection.fields.removeById("text2216123988")

  // remove field
  collection.fields.removeById("text1198612693")

  // remove field
  collection.fields.removeById("text2155218233")

  // remove field
  collection.fields.removeById("text1125137336")

  // remove field
  collection.fields.removeById("text2141580046")

  // remove field
  collection.fields.removeById("text3166950799")

  // remove field
  collection.fields.removeById("text497374169")

  // remove field
  collection.fields.removeById("text3737349464")

  // remove field
  collection.fields.removeById("text1310443792")

  // remove field
  collection.fields.removeById("text2373842833")

  // remove field
  collection.fields.removeById("text3560404062")

  // remove field
  collection.fields.removeById("text391203551")

  // remove field
  collection.fields.removeById("text3701937933")

  // remove field
  collection.fields.removeById("text532752780")

  // remove field
  collection.fields.removeById("text1402861341")

  // remove field
  collection.fields.removeById("text2432420252")

  // remove field
  collection.fields.removeById("text2391493603")

  // remove field
  collection.fields.removeById("text1307407714")

  // remove field
  collection.fields.removeById("bool887888961")

  return app.save(collection)
})
