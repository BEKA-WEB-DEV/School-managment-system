import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { FormInput, SelectInput } from "../common";

const EmployeeListFilters = ({ filters, onFilterChange }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <FormInput
        name="search"
        label="Search Employees"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />
    </Grid>
    <Grid item xs={6} md={4}>
      <SelectInput
        name="role"
        label="Role"
        value={filters.role}
        options={roles}
        onChange={(value) => onFilterChange("role", value)}
      />
    </Grid>
    <Grid item xs={6} md={4}>
      <SelectInput
        name="status"
        label="Status"
        value={filters.status}
        options={statusOptions}
        onChange={(value) => onFilterChange("status", value)}
      />
    </Grid>
  </Grid>
);

EmployeeListFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

const roles = [
  { value: "all", label: "All Roles" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default EmployeeListFilters;
