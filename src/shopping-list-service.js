const shoppingListService = {
  getAllLists(knex) {
    return knex.select().from('shopping_list');
  }
};

module.exports = shoppingListService;