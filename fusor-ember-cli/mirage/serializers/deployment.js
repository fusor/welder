import BaseSerializer from './application';

export default BaseSerializer.extend({

  serialize(modelOrCollection, request={}) {
    // This is how to call super, as Mirage borrows
    // [Backbone's implementation of extend](http://backbonejs.org/#Model-extend)
    let json = BaseSerializer.prototype.serialize.apply(this, arguments);

    // Add meta info
    let totalCount = modelOrCollection.models.length;
    let page = request.params.page ? request.params.page : 1;
    json.meta = { total: totalCount,
                  page: page,
                  total_pages: Math.ceil(totalCount / 20.0)
                };

    return json;
  }

});
