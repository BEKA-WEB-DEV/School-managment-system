import React from "react";
import { Chip } from "@mui/material";
import PropTypes from "prop-types";

const roleColors = {
  admin: "error",
  teacher: "success",
  registrar: "warning",
  academic: "info",
};

const EmployeeRoleTag = ({ role }) => (
  <Chip
    label={role.toUpperCase()}
    color={roleColors[role] || "default"}
    size="small"
    sx={{ textTransform: "capitalize" }}
  />
);

EmployeeRoleTag.propTypes = {
  role: PropTypes.oneOf(["admin", "teacher", "registrar", "academic"])
    .isRequired,
};

export default EmployeeRoleTag;
