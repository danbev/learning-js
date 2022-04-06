const {readFileSync} = require('fs');
const fetch = require('node-fetch');
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const accessToken = readFileSync('.github_token').toString().trim();
// GitHub Security Advisory ID (ghsaId)
const query = `
  query {
    securityAdvisories(orderBy: {field: PUBLISHED_AT, direction: DESC}, first: 1) {
      nodes {
        ghsaId
        severity
        summary
        publishedAt
        updatedAt
        identifiers {
          type
          value
        }
        cwes(first: 10) {
          nodes {
            cweId
            description
          }
          totalCount
        }
      }
    }
  }`;

function send_query() {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({query}),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }).then(res => res.text())
    .catch(error => console.error(error));
}


async function doit() {
  const data = await send_query();
  const advisories = JSON.parse(data);
  const nodes = advisories.data.securityAdvisories.nodes;
  console.log(nodes);
  console.log(nodes[0].publishedAt);
  console.log(nodes[0].updatedAt);
  console.log(nodes[0].cwes.nodes);

  for (const node of nodes) {
    console.log(node.identifiers);
    for (const cwe of node.cwes.nodes) {
      console.log(cwe);
    }
  }
  const ids = advisories.data.securityAdvisories.nodes[0].identifiers;
  for (const id of ids) {
    if (id.type === 'CVE') {
      console.log(id);
    }
  }
  console.log(advisories.data.securityAdvisories.nodes[0].identifiers[0]);

}

doit();
