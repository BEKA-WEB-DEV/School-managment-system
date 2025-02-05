import { Chip } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import PropTypes from "prop-types";

const VerificationBadge = ({ verified }) => (
  <Chip
    icon={verified ? <CheckCircle /> : <Cancel />}
    label={verified ? "Verified" : "Unverified"}
    color={verified ? "success" : "error"}
    variant="outlined"
  />
);

VerificationBadge.propTypes = {
  verified: PropTypes.bool.isRequired,
};

export default VerificationBadge;
