const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      first_name: {
        type: GraphQLString,
        resolve() {
          return 'Mahatma';
        },
      },
      last_name: {
        type: GraphQLString,
        resolve() {
          return 'Fletch';
        },
      },
    },
  }),
});

graphql({ schema, source: '{ first_name, last_name }'}).then((response) => {
  console.log(response);
});
