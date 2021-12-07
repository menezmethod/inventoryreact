import * as React from "react";
import { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Parts from "./components/Parts";
import Products from "./components/Products";
import Box from "@mui/material/Box";

const App = () => {
  const [title, setTitle] = useState("Inventory Management System");

  useEffect(() => {
    document.title = title;
  }, []);

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div align="center">
        <Item>
          <h1>Inventory Management System</h1>
        </Item>
      </div>
      <br />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{
          xs: 1,
          sm: 2,
          md: 3,
        }}
      >
        <Grid item xs={6}>
          <Item>
            <h1>Parts</h1>
            <div
              style={{
                height: "76vh",
                width: "100%",
              }}
            >
              <Parts />
            </div>
            <br />
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <h1>Products</h1>
            <div
              style={{
                height: "76vh",
                width: "100%",
              }}
            >
              <Products />
            </div>
            <br />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};
export default App;
