import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import Controls from "./controls/Controls";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import useForm from "./useForm";
import * as partsService from "../services/partsService";

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
  partName: "",
  partStockLevel: "",
  partCost: "",
  partMin: "",
  partMax: "",
  partMachineId: "",
  partCategory: "",
};

const partsColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
  },
  {
    field: "partName",
    headerName: "Parts Name",
    width: 130,
  },
  {
    field: "partStockLevel",
    headerName: "Inventory",
    width: 130,
  },
  {
    field: "partCost",
    headerName: "Cost",
    width: 130,
  },
];

let partsRows;

const partsCatergories = [
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

export default function Parts(...props) {
  const [parts, setParts] = useState(partsRows);
  const [open, setOpen] = useState(false);
  const [selectionModelParts, setSelectionModelParts] = useState([]);
  const selectedIDs = new Set(selectionModelParts);
  const [first] = selectedIDs;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("partName" in fieldValues)
      temp.partName = fieldValues.partName ? "" : "This field is required.";
    if ("partStockLevel" in fieldValues)
      temp.partStockLevel = /^[0-9]+$/.test(fieldValues.partStockLevel)
        ? ""
        : "Please enter a full number with no decimals.";
    if ("partCost" in fieldValues)
      temp.partCost = /[+-]?([0-9]*[.])?[0-9]+/.test(fieldValues.partCost)
        ? ""
        : "Please enter a number.";
    if ("partMin" in fieldValues)
      temp.partMin = /^[0-9]+$/.test(fieldValues.partMin)
        ? ""
        : "Please enter a number.";
    if ("partMax" in fieldValues)
      temp.partMax = /^[0-9]+$/.test(fieldValues.partMax)
        ? ""
        : "Please enter a number.";
    if ("partMachineId" in fieldValues)
      temp.partMachineId = /^[0-9]+$/.test(fieldValues.partMachineId)
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

  const handleDeletePart = (clickedPart) => {
    console.log("Deleting: " + selectionModelParts);
    axios.delete("http://localhost:8080/api/v1/parts/" + first);
    //setParts((r) => r.filter((x) => !selectedIDs.has(x.id)));
  };

  // const Item = styled(Paper)(({ theme }) => ({
  //   ...theme.typography.body2,
  //   padding: theme.spacing(1),
  //   textAlign: "center",
  //   color: theme.palette.text.secondary,
  // }));

  const handleModify = () => {
    const fetchValues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/parts/" + first
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
    //props.setTitle("Add Part");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // props.setTitle("Inventory Management System");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      partsService.insertPart(values);
      console.log("Submitted " + values);
      handleClose();
      //setParts(JSON.parse(localStorage.getItem("parts")));
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      partsService.editPart(values);
      //console.log("Edited " + values);
      handleClose();
    }
  };

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios
          .get("http://localhost:8080/api/v1/parts")
          .then((response) => {
            setParts(response.data);
          });
        //console.log(response.data)
      } catch (err) {
        console.log(err.response.data);
      }
    };
    fetchParts();
  }, [parts, values, selectionModelParts]);

  return (
    <div style={{ height: "71vh", width: "100%" }}>
      <DataGrid
        rows={parts}
        columns={partsColumns}
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
                  columnField: "partName",
                  operatorValue: "contains",
                  value: "",
                },
              ],
            },
          },
        }}
        onSelectionModelChange={(newSelectionModelParts) => {
          setSelectionModelParts(newSelectionModelParts);
        }}
        selectionModel={selectionModelParts}
      />

      <div align="right">
        <br />
        <Controls.Button text="Add" onClick={() => handleOpen()} />{" "}
        {first && <Controls.Button text="Modify" onClick={handleModify} />}{" "}
        {first && <Controls.Button text="Delete" onClick={handleDeletePart} />}{" "}
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
              <h2>{first ? "Edit" : "Add"} Part</h2>
            </div>
            <div>
              <Controls.RadioGroup
                name="partCategory"
                label="Category"
                value={values.partCategory}
                onChange={handleInputChange}
                items={partsCatergories}
              />
            </div>
            <div>
              <Controls.Input
                name="partName"
                label="Part Name"
                value={values.partName}
                onChange={handleInputChange}
                error={errors.partName}
              />
            </div>

            <div>
              <Controls.Input
                name="partStockLevel"
                label="Inventory"
                value={values.partStockLevel}
                onChange={handleInputChange}
                error={errors.partStockLevel}
              />
            </div>

            <div>
              <Controls.Input
                name="partCost"
                label="Cost"
                value={values.partCost}
                onChange={handleInputChange}
                error={errors.partCost}
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
                  name="partMin"
                  label="Min"
                  variant="standard"
                  value={values.partMin}
                  onChange={handleInputChange}
                  fullWidth
                  error={errors.partMin}
                />
              </Grid>
              <Grid item xs={6}>
                <Controls.Input
                  name="partMax"
                  label="Max"
                  variant="standard"
                  value={values.partMax}
                  onChange={handleInputChange}
                  fullWidth
                  error={errors.partMax}
                />
              </Grid>
            </Grid>
            <div>
              <Controls.Input
                name="partMachineId"
                label="Machine ID"
                variant="standard"
                value={values.partMachineId}
                onChange={handleInputChange}
                fullWidth
                error={errors.partMachineId}
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
