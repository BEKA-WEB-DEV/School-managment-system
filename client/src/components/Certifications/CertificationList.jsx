import { Card, Typography, Stack } from "@mui/material";
import PropTypes from "prop-types";
import VerificationBadge from "./CertificationDetails";

const CertificateCard = ({ certificate }) => (
  <Card sx={{ p: 2 }}>
    <Stack spacing={1}>
      <Typography variant="h6">{certificate.studentName}</Typography>
      <Typography variant="body2">{certificate.examName}</Typography>
      <Typography variant="body2">Score: {certificate.score}/100</Typography>
      <VerificationBadge verified={certificate.verified} />
    </Stack>
  </Card>
);

CertificateCard.propTypes = {
  certificate: PropTypes.shape({
    studentName: PropTypes.string.isRequired,
    examName: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    verified: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CertificateCard;
