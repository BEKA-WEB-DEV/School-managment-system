import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { FormInput, DatePicker, SelectInput } from "../common";

const CertificateForm = ({ control, errors }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <SelectInput
        name="studentId"
        control={control}
        label="Student"
        options={[]}
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <FormInput
        name="examName"
        control={control}
        label="Exam Name"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <DatePicker
        name="issueDate"
        control={control}
        label="Issue Date"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <FormInput
        name="score"
        control={control}
        label="Score"
        type="number"
        errors={errors}
      />
    </Grid>
  </Grid>
);

CertificateForm.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default CertificateForm;
