const shoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

// id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
// name TEXT NOT NULL,
// price DECIMAL(19, 2) NOT NULL,
// date_added TIMESTAMP DEFAULT now() NOT NULL,
// checked BOOLEAN DEFAULT false NOT NULL,
// category grocery NOT NULL


describe('Shopping List service object', () => {
  let db;
  let testLists = [
    {
      id: 1,
      name: 'test 1',
      price: '20.20',
      date_added: new Date(),
      category: 'Snack',
      checked: false
    },
    {
      id: 2,
      name: 'test 2',
      price: '20.30',
      date_added: new Date(),
      category: 'Snack',
      checked: false
    },
    {
      id: 3,
      name: 'test 3',
      price: '20.44',
      date_added: new Date(),
      category: 'Snack',
      checked: false
    }
  ];
  // ? before testing set db to be our knex config
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  // ? truncate db so that we have a clean db to work with
  before(() => db('shopping_list').truncate());

  // ? truncate after each test
  afterEach(() => db('shopping_list').truncate());

  // ? after all tests destroy connection to database
  after(() => db.destroy());

  // ? test for blogful_articles having data
  context('Given "shopping_list" has data', () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testLists);
    });
    it('getAllItems() resolves all items from "shopping_list" table', () => {
    // test that shoppinngListServices
      const expectedItems = testLists.map(list => ({
        ...list,
        checked: false
      }));
      return shoppingListService.getAllLists(db)
        .then(actual => {
          expect(actual).to.eql(expectedItems);
        })
    })
    it('getById() resolves article by id from shopping_list table', () => {
      const secondId = 2;
      const secondTestItem = testLists[secondId - 1];
      return shoppingListService.getById(db, secondId)
        .then(actual => {
          expect(actual).to.eql({
            id: secondId,
            name: secondTestItem.name,
            price: secondTestItem.price,
            date_added: secondTestItem.date_added,
            category: secondTestItem.category,
            checked: false
          })
        })
    })
    it('deleteItem() removes an item by id from shopping_list table', () => {
      const itemId = 2;
      return shoppingListService.deleteItem(db, itemId)
        .then(() => shoppingListService.getAllLists(db))
        .then(allItems => {
          const expected = testLists.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected);
        })
    })
    it('updateItem() updates an item from shopping_list table', () => {
      const idOfItem = 1;
      const newItemData = {
        name: 'new name',
        price: '77.88',
        date_added: new Date(),
        category: 'Breakfast',
        checked: true
      };
      return shoppingListService.updateItem(db, idOfItem, newItemData)
      .then(() => shoppingListService.getById(db, idOfItem))
        .then(item => {
          expect(item).to.eql({
            id: idOfItem,
            ...newItemData,
          })
        })
    })

  });
  context('Given "shopping_list" does not have data', () => {
    it('getAllArticles() resolves an empty array', () => {
      return shoppingListService.getAllLists(db)
      .then(actual => {
        expect(actual).to.eql([]);
      });
    })
    it('insertListItem() inserts a new item and resolves the new item with an id', () => {
      const newItem = {
        name: 'Test new name',
        price: '33.33',
        date_added: new Date(),
        category: 'Breakfast',
        checked: false
      }
      return shoppingListService.insertListItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            category: newItem.category,
            checked: newItem.checked
          })
        })
    })
  })
});