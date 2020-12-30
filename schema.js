const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

// Launch Type
const LaunchType = new GraphQLObjectType({
  name: "Launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
}); // This is the object that we're "building" and  will be requesting from the API. i.e "API, here is a custom object that I've built, return this data when requested"

// Rocket Type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
}); // Exact same concept as Launch Type. "rocket" is an object in the API, so we're building a custom object that returns these properties ONLY.

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/launches/")
          .then((res) => res.data);
      },
    }, // returns a list of ALL launches
    launch: {
      type: LaunchType, // DOES NOT need to be GraphQLList since we're grabbing a single Launch.
      args: {
        flight_number: { type: GraphQLInt },
      }, // This is what we want to use to find the specific launch. In most cases, this will be the id.
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then((res) => res.data);
      },
    }, // returns a single launch
  },
  rockets: {
    type: new GraphQLList(RocketType),
    resolve(parent, args) {
      return axios
        .get("https://api.spacexdata.com/v3/rockets/")
        .then((res) => res.data);
    },
  },
  rocket: {
    type: RocketType,
    args: {
      id: { type: GraphQLInt },
    },
    resolve(parent, args) {
      return axios
        .get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
        .then((res) => res.data);
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
