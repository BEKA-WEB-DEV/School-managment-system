import { Chip } from "@mui/material";
import PropTypes from "prop-types";

const ResultStatus = ({ passed }) => (
  <Chip
    label={passed ? "Passed" : "Failed"}
    color={passed ? "success" : "error"}
    size="small"
    sx={{ width: "80px" }}
  />
);

ResultStatus.propTypes = {
  passed: PropTypes.bool.isRequired,
};

export default ResultStatus;
