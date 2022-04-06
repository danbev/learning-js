const {readFileSync} = require('fs');
const fetch = require('node-fetch');
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const accessToken = readFileSync('.github_token').toString().trim();
const query = `
  query {
    repository(owner:"danbev", name:"learning-v8") {
      issues(states:CLOSED) {
        totalCount
      }
    }
  }`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  body: JSON.stringify({query}),
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
}).then(res => res.text())
  .then(body => console.log(body))
  .catch(error => console.error(error));
