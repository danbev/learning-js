const {readFileSync} = require('fs');
const fetch = require('node-fetch');
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const accessToken = readFileSync('.github_token').toString().trim();
// GitHub Security Advisory ID (ghsaId)
const query = `
  query {
    securityAdvisory(ghsaId: "GHSA-pw2r-vq6v-hr8c") {
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
  const advisory = JSON.parse(data);
  console.log(advisory);
}

doit();
