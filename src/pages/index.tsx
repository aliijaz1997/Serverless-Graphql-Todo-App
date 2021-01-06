import React from "react"
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';


// This query is executed at run time by Apollo.
const Get_All_Tasks = gql`
{
  todo {
    task,
    id,
    statusofthetask
  }
}
`;
const ADD_Task = gql`
mutation addTask ( $task : String!) {
  addTask (task : $task) {
    task
  }
}
`

export default function Home() {
  const [addTask] = useMutation(ADD_Task)
  let input;
  const { loading, error, data } = useQuery(Get_All_Tasks);
  // console.log(error);
  console.log(data)
  // console.log(addTask)
 if (error) {
   return `Error is ${error.message}`
 }
  return (
      <div>
        <h2>Data Received from Apollo Client at runtime from Serverless Function:</h2>
        {loading && <p>Loading Client Side Querry...</p>}
        <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTask({ variables: { task: input.value },refetchQueries: [{ query: Get_All_Tasks }] });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
      </div>
      </div>
  );
    
}
