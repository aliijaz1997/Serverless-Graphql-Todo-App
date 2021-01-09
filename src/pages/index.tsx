import React, { useState } from "react"
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
// Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  paper1: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  grid: {
    justifyContent: "center",
    margin: -20,
    height: "102vh",
    backgroundColor: "lightblue"
  }
}));

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
  const classes = useStyles();
  const [addTask] = useMutation(ADD_Task)
  let input: any;
  const { loading, error, data } = useQuery(Get_All_Tasks);
  // console.log(error);
  console.log(data)
  // console.log(addTask)
  if (loading) {
    return (
      <React.Fragment>
        <Container maxWidth="sm">
          <CircularProgress disableShrink />
        </Container>
      </React.Fragment>
    );
  }
  if (error) {
    return `Error is ${error.message}`
  }
  return (
    <Grid className={classes.grid} container spacing={3}>
      <Grid item xs={10}>
        <Paper
          style={{
            fontSize: "2em",
            color: "cornflowerblue"
          }}
          className={classes.paper}>Todo App</Paper>
      </Grid>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <form
            onSubmit={e => {
              e.preventDefault();
              addTask({ variables: { task: input.value }, refetchQueries: [{ query: Get_All_Tasks }] });
              input.value = '';
            }}
          >
            <input
              placeholder="Write your task here"
              style={{
                width: "100%",
                height: 30,
                border: "solid",
                marginBottom: 20
              }}
              ref={node => {
                input = node;
              }}
            />
            <br />
            <Button type="submit" variant="contained" color="primary" disableElevation>
              Add Task
            </Button>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        {data.todo.map((task: { statusofthetask: boolean; task: React.ReactNode; }, id: string | number | null | undefined) => {
          return <Paper key={id} className={classes.paper1}>
            <input
              type="checkbox"
              name="checked"
            />
            {task.task}
          </Paper>
        })}
      </Grid>
    </Grid>
  );

}
