const shoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

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
      category: 'Snack'
    },
    {
      id: 2,
      name: 'test 2',
      price: '20.30',
      date_added: new Date(),
      category: 'Snack'
    },
    {
      id: 3,
      name: 'test 3',
      price: '20.44',
      date_added: new Date(),
      category: 'Snack'
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