import React from "react";
import { Card, Typography, LinearProgress, Chip } from "@mui/material";
import PropTypes from "prop-types";
import { format } from "date-fns";

const ExamCard = ({ exam }) => (
  <Card sx={{ p: 2, mb: 2 }}>
    <div
      className="exam-header"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Typography variant="h6">{exam.subject}</Typography>
      <Chip label={exam.type} color="primary" size="small" />
    </div>
    <Typography variant="body2" color="text.secondary">
      {format(new Date(exam.date), "PPp")}
    </Typography>
    <div className="exam-progress" style={{ marginTop: "1rem" }}>
      <Typography variant="caption">Preparation Progress</Typography>
      <LinearProgress
        variant="determinate"
        value={exam.progress}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </div>
  </Card>
);

ExamCard.propTypes = {
  exam: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
  }).isRequired,
};

export default ExamCard;
