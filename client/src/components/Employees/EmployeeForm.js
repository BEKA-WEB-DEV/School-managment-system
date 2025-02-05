import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { FormInput, DatePicker, SelectInput } from "../common";

const EmployeeForm = ({ control, errors }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <FormInput
        name="firstName"
        control={control}
        label="First Name"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <FormInput
        name="lastName"
        control={control}
        label="Last Name"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <SelectInput
        name="role"
        control={control}
        label="Role"
        options={roles}
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <DatePicker
        name="hireDate"
        control={control}
        label="Hire Date"
        errors={errors}
      />
    </Grid>
  </Grid>
);

EmployeeForm.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Administrator" },
  { value: "registrar", label: "Registrar" },
];

export default EmployeeForm;
