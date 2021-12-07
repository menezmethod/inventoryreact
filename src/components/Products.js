import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import Controls from "./controls/Controls";
import Button from "@mui/material/Button";
import useForm from "./useForm";
import * as productsService from "../services/productsService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  id: 0,
  productName: "",
  productStockLevel: "",
  productCost: "",
  productMin: "",
  productMax: "",
  productMachineId: "",
};

const productsColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  {
    field: "productName",
    headerName: "Products Name",
    width: 130,
  },
  {
    field: "productStockLevel",
    headerName: "Inventory",
    width: 130,
  },
  {
    field: "productCost",
    headerName: "Cost",
    width: 130,
  },
];

// Data from LocalStorage
let productsRows;

const productsCatergories = [
  {
    id: "inhouse",
    title: "In-House",
  },
  {
    id: "outsourced",
    title: "Outsourced",
  },
];
const axios = require("axios");

export default function Products(...props) {
  const [products, setProducts] = useState(productsRows);
  const [open, setOpen] = useState(false);
  const [selectionModelProducts, setSelectionModelProducts] = useState([]);
  const selectedIDs = new Set(selectionModelProducts);
  const [first] = selectedIDs;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("productName" in fieldValues)
      temp.productName = fieldValues.productName
        ? ""
        : "This field is required.";
    if ("productStockLevel" in fieldValues)
      temp.productStockLevel = /^[0-9]+$/.test(fieldValues.productStockLevel)
        ? ""
        : "Please enter a full number with no decimals.";
    if ("productCost" in fieldValues)
      temp.productCost = /[+-]?([0-9]*[.])?[0-9]+/.test(fieldValues.productCost)
        ? ""
        : "Please enter a number.";
    if ("productMin" in fieldValues)
      temp.productMin = /^[0-9]+$/.test(fieldValues.productMin)
        ? ""
        : "Please enter a number.";
    if ("productMax" in fieldValues)
      temp.productMax = /^[0-9]+$/.test(fieldValues.productMax)
        ? ""
        : "Please enter a number.";
    if ("productMachineId" in fieldValues)
      temp.productMachineId = /^[0-9]+$/.test(fieldValues.productMachineId)
        ? ""
        : "Please enter a number.";
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, handleInputChange, errors, setErrors, setValues } = useForm(
    initialValues,
    true,
    validate
  );

  const handleDeleteProduct = (clickedProduct) => {
    console.log("Deleting: " + selectionModelProducts);
    axios.delete("http://localhost:8080/api/v1/products/" + first);
    //setProducts((r) => r.filter((x) => !selectedIDs.has(x.id)));
  };

  const handleModify = () => {
    const fetchValues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/products/" + first
        );
        console.log(response.data);
        setValues(response.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    fetchValues();
    //console.log(values)
    handleOpen();
  };
  const handleOpen = (event) => {
    //props.setTitle("Add Product");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // props.setTitle("Inventory Management System");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      productsService.insertProduct(values);
      console.log("Submitted " + values);
      handleClose();
      //setProducts(JSON.parse(localStorage.getItem("products")));
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      productsService.editProduct(values);
      //console.log("Edited " + values);
      handleClose();
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios
          .get("http://localhost:8080/api/v1/products")
          .then((response) => {
            setProducts(response.data);
          });
        //console.log(response.data)
      } catch (err) {
        console.log(err.response.data);
      }
    };
    fetchProducts();
  }, [products, values, selectionModelProducts]);

  return (
    <div style={{ height: "71vh", width: "100%" }}>
      <DataGrid
        rows={products}
        columns={productsColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{
          Toolbar: GridToolbar,
        }}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  columnField: "productName",
                  operatorValue: "contains",
                  value: "",
                },
              ],
            },
          },
        }}
        onSelectionModelChange={(newSelectionModelProducts) => {
          setSelectionModelProducts(newSelectionModelProducts);
        }}
        selectionModel={selectionModelProducts}
      />

      <div align="right">
        <br />
        <Controls.Button text="Add" onClick={handleOpen} />{" "}
        {first && <Controls.Button text="Modify" onClick={handleModify} />}{" "}
        {first && (
          <Controls.Button text="Delete" onClick={handleDeleteProduct} />
        )}{" "}
      </div>
      <div>
        {" "}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} component="form" onSubmit={handleSubmit}>
            <div align="center">
              <h2>Add Product</h2>
            </div>
            <div>
              <Controls.Input
                name="productName"
                label="Product Name"
                value={values.productName}
                onChange={handleInputChange}
                error={errors.productName}
              />
            </div>

            <div>
              <Controls.Input
                name="productStockLevel"
                label="Inventory"
                value={values.productStockLevel}
                onChange={handleInputChange}
                error={errors.productStockLevel}
              />
            </div>

            <div>
              <Controls.Input
                name="productCost"
                label="Cost"
                value={values.productCost}
                onChange={handleInputChange}
                error={errors.productCost}
              />
            </div>
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
                <Controls.Input
                  name="productMin"
                  label="Min"
                  variant="standard"
                  value={values.productMin}
                  onChange={handleInputChange}
                  fullWidth
                  error={errors.productMin}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="productMax"
                  label="Max"
                  variant="standard"
                  value={values.productMax}
                  onChange={handleInputChange}
                  fullWidth
                  error={errors.productMax}
                />
              </Grid>
            </Grid>
            <div>
              <Controls.Input
                name="productMachineId"
                label="Machine ID"
                variant="standard"
                value={values.productMachineId}
                onChange={handleInputChange}
                fullWidth
                error={errors.productMachineId}
              />
            </div>
            <br />
            <br />
            <div align="center">
              {first ? (
                <Button onClick={handleEdit}>Edit</Button>
              ) : (
                <Button onClick={handleSubmit}>Add</Button>
              )}
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
