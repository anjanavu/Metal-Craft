import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";

import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
const StyledSearchbar = ({onchange,placeholder}) => {
  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      onChange={onchange}
      sx={{
        width: "320px",
        
        height: "48px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          height: "48px",bgcolor: "white",
          boxShadow:
            "0 -4px 6px -1px rgba(0, 0, 0, 0.01), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
          "& input": {
            height: "48px",
            padding: "0 12px"
          },
          "& fieldset": {
            border: "none",
            borderRadius: "24px",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon path={mdiMagnify}  color={"#828282"} size={1}/>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default StyledSearchbar;
