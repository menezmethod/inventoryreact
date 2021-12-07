import React from 'react'
import TextField from '@mui/material/TextField';

export default function Input(props) {

    const { name, label, value,error=null, onChange } = props;
    return (
        <TextField
            variant="standard"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            fullWidth
            {...(error && {error:true,helperText:error})}
        />
    )
}