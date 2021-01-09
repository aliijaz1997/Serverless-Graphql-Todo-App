const { ApolloServer, gql } = require("apollo-server-lambda");
var faunadb = require("faunadb");
q = faunadb.query;
const typeDefs = gql`
  type Query {
     todo : [Todo!]
  }
  type Todo {
    id : ID!
    task : String!
    statusofthetask : Boolean!
  }
  type Mutation {
    addTask(task : String!) : Todo  
  }
`;

const resolvers = {
  Query: {
    todo: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD-uDWGkACB2cZcY9900jX220NPb0qHvsPOXPl" });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("tasksindex"))),
            q.Lambda(x => q.Get(x))
          )
        );
        console.log(result)
        return result.data.map(tasks => {
          return {
            task : tasks.data.task,
            id : tasks.ts,
            statusofthetask : tasks.data.statusofthetask
          }
        })
      } catch (error) {
        console.log(`Error is ${error}` );
      }
    }
  },
  Mutation: {
    addTask: async (_, {task}) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD-uDWGkACB2cZcY9900jX220NPb0qHvsPOXPl" });
        var result = await client.query(
          q.Create(
            q.Collection('tasks'),
            { data : {
              task : task,
              statusofthetask : true
            } },
          )
        );
        console.log(result.ref.data)
        return result.ref.data;
      } catch (error) {
        console.log(`Error is ${error}` );
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // playground: true,
  // introspection: true
});

exports.handler = server.createHandler();

