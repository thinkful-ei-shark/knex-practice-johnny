const shoppingListService = {
  getAllLists(knex) {
    return knex.select('*').from('shopping_list');
  },
  insertListItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  }
};

module.exports = shoppingListService;