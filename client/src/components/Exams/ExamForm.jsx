import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { FormInput, DatePicker, SelectInput } from "../common";

const ExamForm = ({ control, errors }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <FormInput
        name="subject"
        control={control}
        label="Subject"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <SelectInput
        name="type"
        control={control}
        label="Exam Type"
        options={examTypes}
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <DatePicker
        name="date"
        control={control}
        label="Exam Date"
        errors={errors}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <FormInput
        name="duration"
        control={control}
        label="Duration (minutes)"
        type="number"
        errors={errors}
      />
    </Grid>
  </Grid>
);

ExamForm.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

const examTypes = [
  { value: "midterm", label: "Midterm" },
  { value: "final", label: "Final" },
  { value: "quiz", label: "Quiz" },
];

export default ExamForm;
