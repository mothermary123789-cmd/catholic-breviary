/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_688734120")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2268741758",
    "max": 0,
    "min": 0,
    "name": "nameEn",
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
    "id": "text1146912511",
    "max": 0,
    "min": 0,
    "name": "nameTa",
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
    "id": "text3602283318",
    "max": 0,
    "min": 0,
    "name": "feastDate",
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
    "id": "text3770962772",
    "max": 0,
    "min": 0,
    "name": "lifeHistoryEn",
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
    "id": "text597847509",
    "max": 0,
    "min": 0,
    "name": "lifeHistoryTa",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url2548032275",
    "name": "imageUrl",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(7, new Field({
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
  const collection = app.findCollectionByNameOrId("pbc_688734120")

  // remove field
  collection.fields.removeById("text2268741758")

  // remove field
  collection.fields.removeById("text1146912511")

  // remove field
  collection.fields.removeById("text3602283318")

  // remove field
  collection.fields.removeById("text3770962772")

  // remove field
  collection.fields.removeById("text597847509")

  // remove field
  collection.fields.removeById("url2548032275")

  // remove field
  collection.fields.removeById("bool887888961")

  return app.save(collection)
})
